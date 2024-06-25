import { produce } from 'immer';
import { findProperTrackIndex, formatPaintInfo2SegmentInfo } from '../utils';
import { type PaintInfo } from '../components/Rectangle';
import { SegmentInfo, TrackInfo, useTimelineStore } from '.';
import { assert } from '../../base/assert';
import { generateUuid } from '../../base/uuid';

const get = useTimelineStore.getState;
const set = useTimelineStore.setState;

const findSegmentInfoById = (segmentId: string, tracks: TrackInfo[]) => {
  let targetSegment: SegmentInfo | undefined;
  tracks.forEach((track) => {
    targetSegment = track.segments.find((seg) => segmentId === seg.id);
  });
  assert(targetSegment !== undefined);
  return targetSegment;
};

const updateSegment = (paintInfo: PaintInfo, trackRenderIndex: number) => {
  const segmentInfo = formatPaintInfo2SegmentInfo(paintInfo);
  set((store) =>
    produce(store, (draft) => {
      const targetSegment = findSegmentInfoById(paintInfo.id, draft.tracks);

      targetSegment.targetTimeRange = segmentInfo.targetTimeRange;
      targetSegment.trackRenderIndex = trackRenderIndex;
    })
  );
};

const addNewTrack = (paintInfo: PaintInfo, trackRenderIndex: number) => {
  // TODO 正确添加，空轨删除
  const segmentInfo = formatPaintInfo2SegmentInfo(paintInfo);
  const newTrack = {
    id: `track-${generateUuid()}`,
    type: 'video',
    trackIndex: trackRenderIndex,
    segments: [
      {
        id: `segment-${generateUuid()}`,
        type: segmentInfo.type,
        trackRenderIndex: trackRenderIndex,
        targetTimeRange: segmentInfo.targetTimeRange,
      },
    ],
  };
  set((store) =>
    produce(store, (draft) => {
      // index 位置 替换 0 个元素
      draft.tracks.splice(1, 0, newTrack);
    })
  );
};

const dragSegment = (paintInfo: PaintInfo) => {
  const tracksInfo = get().tracks;

  const { targetInEmpty, targetIndex } = findProperTrackIndex(
    paintInfo,
    tracksInfo
  );

  if (targetInEmpty) {
    // 新增轨道
    console.log('新增轨道', { targetInEmpty, targetIndex });
    addNewTrack(paintInfo, targetIndex);
  } else {
    // 移动至已有轨道
    console.log('移动至已有轨道', { targetInEmpty, targetIndex });
    updateSegment(paintInfo, targetIndex);
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
      const oldSegmentInfo = findSegmentInfoById(paintInfo.id, get().tracks);
      updateSegment(paintInfo, oldSegmentInfo.trackRenderIndex);
      break;

    case ActionType.Drag:
      dragSegment(paintInfo);
      break;

    default:
      break;
  }
};
