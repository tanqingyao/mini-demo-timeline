import { TrackHeight, parseSegmentInfo2PaintInfo } from '../utils';
import { useTimelineStore } from './core';

export const useSegmentList = () => {
  const tracksInfo = useTimelineStore((store) => store.tracks);
  const segmentList = tracksInfo.flatMap((track) =>
    track.segments.map(parseSegmentInfo2PaintInfo)
  );
  return segmentList;
};

export const useTrackList = () => {
  const tracksInfo = useTimelineStore((store) => store.tracks);
  const trackList = tracksInfo.map((x, index) => ({
    id: x.id,
    x: 0,
    y: index * (TrackHeight * 1.2),
    // 轨道宽度为画布宽度
    // width: stageWidth,
    height: TrackHeight, // 定值高度
  }));
  return trackList;
};
