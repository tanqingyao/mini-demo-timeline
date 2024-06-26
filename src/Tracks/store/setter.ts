import { produce } from 'immer';
import { findProperTrackIndex, formatPaintInfo2SegmentInfo } from '../utils';
import { type PaintInfo } from '../components/Rectangle';
import { SegmentInfo, useTimelineStore } from '.';
import { assert } from '../../base/assert';

const get = useTimelineStore.getState;
const set = useTimelineStore.setState;

const findSegmentInfoById = (segmentId: string, segments: SegmentInfo[]) => {
  const targetSegment = segments.find((seg) => segmentId === seg.id);
  assert(targetSegment !== undefined);
  return targetSegment;
};

const transformSegment = (paintInfo: PaintInfo) => {
  const segmentInfo = formatPaintInfo2SegmentInfo(paintInfo);
  set((store) =>
    produce(store, (draft) => {
      const targetSegment = findSegmentInfoById(paintInfo.id, draft.segments);
      targetSegment.targetTimeRange = segmentInfo.targetTimeRange;
    })
  );
};

/** 移动至已有轨道 */
const moveSegmentOldTrack = (paintInfo: PaintInfo, targetIndex: number) => {
  const segmentInfo = formatPaintInfo2SegmentInfo(paintInfo);
  set((store) =>
    produce(store, (draft) => {
      const targetSegment = findSegmentInfoById(paintInfo.id, draft.segments);
      const oldIndex = targetSegment.trackRenderIndex;
      if (oldIndex === targetIndex) {
        targetSegment.targetTimeRange = segmentInfo.targetTimeRange;
        targetSegment.updateTime = Date.now(); // forceUpdate react
        console.log('当前轨道拖动');
        return;
      }

      targetSegment.trackRenderIndex = targetIndex;
      console.log('移动至已有轨道');

      const remainSegmentOldTrack = draft.segments.some(
        (seg) => seg.trackRenderIndex === oldIndex
      );
      if (oldIndex !== targetIndex && !remainSegmentOldTrack) {
        draft.segments.forEach((seg) => {
          if (seg.trackRenderIndex >= oldIndex) {
            seg.trackRenderIndex -= 1;
          }
        });
      }
      console.log('移动至已有轨道，清空多余轨');
    })
  );
};

/** 新增segment至轨道 */
const moveSegmentNewTrack = (paintInfo: PaintInfo, targetIndex: number) => {
  const segmentInfo = formatPaintInfo2SegmentInfo(paintInfo);
  set((store) =>
    produce(store, (draft) => {
      const targetSegment = findSegmentInfoById(paintInfo.id, draft.segments);
      // 后续所有轨道 trackRenderIndex 新增1
      draft.segments.forEach((seg) => {
        if (seg.trackRenderIndex >= targetIndex) {
          seg.trackRenderIndex += 1;
        }
      });

      // 新增 track，原有segment落入新轨道
      targetSegment.trackRenderIndex = targetIndex;
      targetSegment.targetTimeRange = segmentInfo.targetTimeRange;
      targetSegment.updateTime = Date.now(); // forceUpdate react
      console.log('新增轨道', { targetIndex });
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
    moveSegmentNewTrack(paintInfo, targetIndex);
  } else {
    moveSegmentOldTrack(paintInfo, targetIndex);
  }
};
export enum ActionType {
  Drag = 'Drag',
  Transform = 'Transform',
}

export const actionsReducer = (
  actionType: ActionType,
  paintInfo: PaintInfo
) => {
  switch (actionType) {
    case ActionType.Transform:
      transformSegment(paintInfo);
      break;

    case ActionType.Drag:
      dragSegment(paintInfo);
      break;

    default:
      break;
  }
};
