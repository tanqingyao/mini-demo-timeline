import { generateUuid } from '../../base/uuid';
import { TrackHeight, parseSegmentInfo2PaintInfo } from '../utils';
import { useTimelineStore } from './core';

export const useSegmentList = () => {
  const segments = useTimelineStore((store) => store.segments);
  const segmentList = segments.map(parseSegmentInfo2PaintInfo);

  return segmentList;
};

export const useTrackList = () => {
  const trackRenderIndexArray = useTimelineStore.getState().getTracksIndex();
  const trackList = trackRenderIndexArray.map((x, index) => ({
    id: `${x}::${generateUuid()}`,
    x: 0,
    y: index * (TrackHeight * 1.2),
    // 轨道宽度为画布宽度
    // width: stageWidth,
    height: TrackHeight, // 定值高度
  }));

  return trackList;
};
