import { type WritableDraft, produce } from 'immer';
import { findProperTrackIndex, formatPaintInfo2SegmentInfo } from '../utils';
import { type PaintInfo } from '../components/Rectangle';
import { SegmentInfo, useTimelineStore } from '.';
import { assert } from '../../base/assert';

type IDraft = WritableDraft<{
  segments: SegmentInfo[];
}>;
const get = useTimelineStore.getState;
const set = useTimelineStore.setState;

/** 统一清空空轨 */
const _clearEmptyTrackMutation = (draft: IDraft) => {
  const indexes = [
    ...new Set(draft.segments.map((x) => x.trackRenderIndex)),
  ].sort((a, b) => a - b);

  let missingIndex = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < indexes.length; i++) {
    if (indexes[i] !== i) {
      missingIndex = i;
    }
  }
  if (missingIndex === Number.MAX_SAFE_INTEGER) {
    return;
  }
  draft.segments.forEach((seg) => {
    if (seg.trackRenderIndex >= missingIndex) {
      seg.trackRenderIndex -= 1;
    }
  });
  console.log('清空空轨');
};

/** 更新segment位置 */
const _updateSegmentMutation = (
  draft: IDraft,
  paintInfo: PaintInfo,
  targetIndex?: number
) => {
  const segmentInfo = formatPaintInfo2SegmentInfo(paintInfo);
  const targetSegment = findSegmentInfoById(paintInfo.id, draft.segments);
  targetSegment.targetTimeRange = segmentInfo.targetTimeRange;
  targetSegment.updateTime = Date.now(); // forceUpdate react
  if (targetIndex !== undefined) {
    targetSegment.trackRenderIndex = targetIndex;
  }
  console.log('update segment');
};

/** 更新segment位置 */
const _addSegmentMutation = (
  draft: IDraft,
  paintInfo: PaintInfo,
  targetIndex?: number
) => {
  const targetSegment = formatPaintInfo2SegmentInfo(paintInfo);

  targetSegment.updateTime = Date.now(); // forceUpdate react
  if (targetIndex !== undefined) {
    targetSegment.trackRenderIndex = targetIndex;
  }
  draft.segments.push(targetSegment);
  console.log('add new segment');
};

/** add new track by index */
const _addTrackByIndexMutation = (draft: IDraft, targetIndex: number) => {
  // 后续所有轨道 trackRenderIndex 新增1
  draft.segments.forEach((seg) => {
    if (seg.trackRenderIndex >= targetIndex) {
      seg.trackRenderIndex += 1;
    }
  });
  console.log('新增轨道');
};

const findSegmentInfoById = (segmentId: string, segments: SegmentInfo[]) => {
  const targetSegment = segments.find((seg) => segmentId === seg.id);
  assert(targetSegment !== undefined);
  return targetSegment;
};

const transformSegmentAction = (paintInfo: PaintInfo) => {
  set((store) =>
    produce(store, (draft) => {
      _updateSegmentMutation(draft, paintInfo);
    })
  );
};

/** 移动至已有轨道 */
const moveSegmentOtherTrackAction = (
  paintInfo: PaintInfo,
  targetIndex: number
) => {
  set((store) =>
    produce(store, (draft) => {
      _updateSegmentMutation(draft, paintInfo, targetIndex);

      _clearEmptyTrackMutation(draft);
    })
  );
};

/** move segment to new added track */
const moveSegmentNewTrackAction = (
  paintInfo: PaintInfo,
  targetIndex: number
) => {
  set((store) =>
    produce(store, (draft) => {
      _addTrackByIndexMutation(draft, targetIndex);

      _updateSegmentMutation(draft, paintInfo, targetIndex);

      _clearEmptyTrackMutation(draft);
    })
  );
};

const clickMaterialAction = (paintInfo: PaintInfo, targetIndex: number) => {
  set((store) =>
    produce(store, (draft) => {
      _addTrackByIndexMutation(draft, targetIndex);

      _addSegmentMutation(draft, paintInfo, targetIndex);

      _clearEmptyTrackMutation(draft);
    })
  );
};
const dragSegment = (paintInfo: PaintInfo) => {
  const tracksCount = get().getTracksIndex().length;

  const { targetInEmpty, targetIndex } = findProperTrackIndex(
    paintInfo,
    tracksCount
  );

  if (targetInEmpty) {
    moveSegmentNewTrackAction(paintInfo, targetIndex);
  } else {
    moveSegmentOtherTrackAction(paintInfo, targetIndex);
  }
};

export enum ActionType {
  ClickMaterial = 'ClickMaterial',
  DragMaterial = 'DragMaterial',
  DragSegment = 'DragSegment',
  TransformSegment = 'TransformSegment',
}

export const actionsReducer = (
  actionType: ActionType,
  paintInfo: PaintInfo
) => {
  switch (actionType) {
    case ActionType.TransformSegment:
      // TODO 元素碰撞检测
      transformSegmentAction(paintInfo);
      break;

    case ActionType.DragSegment:
      dragSegment(paintInfo);
      break;

    case ActionType.ClickMaterial:
      // 新增至最顶层
      clickMaterialAction(paintInfo, 0);
      break;
    default:
      break;
  }
};
