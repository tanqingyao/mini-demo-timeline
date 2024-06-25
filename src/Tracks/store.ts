import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { TrackHeight, timestamp2pixel } from './utils';
import { type PaintInfo } from './components/Rectangle';

export const initialStates = {
  tracks: [
    {
      id: 'track-0',
      type: 'video',
      segments: [
        {
          id: 'segment-0',
          type: 'segment-video',
          trackRenderIndex: 0,
          targetTimeRange: {
            start: 0,
            duration: 500,
          },
        },
        {
          id: 'segment-1',
          type: 'segment-video',
          trackRenderIndex: 0,
          targetTimeRange: {
            start: 1000,
            duration: 500,
          },
        },
      ],
    },

    {
      id: 'track-2',
      type: 'text',
      segments: [
        {
          id: 'segment-2',
          type: 'segment-text',
          trackRenderIndex: 1,
          targetTimeRange: {
            start: 2000,
            duration: 500,
          },
        },
        {
          id: 'segment-3',
          type: 'segment-text',
          trackRenderIndex: 1,
          targetTimeRange: {
            start: 3000,
            duration: 500,
          },
        },
      ],
    },
  ],
};

export const useDraft = create(
  combine(initialStates, (set, get) => ({
    updateTrack() {},
  }))
);

export const useSegmentList = () => {
  const tracksInfo = useDraft((store) => store.tracks);
  const segmentList = tracksInfo.flatMap<PaintInfo>((track) =>
    track.segments.map((segment) => ({
      id: segment.id,
      type: segment.type,
      fill: segment.type === 'segment-video' ? '#f00' : '#00f',
      x: timestamp2pixel(segment.targetTimeRange.start),
      y: segment.trackRenderIndex * (TrackHeight * 1.2),
      width: timestamp2pixel(segment.targetTimeRange.duration),
      height: TrackHeight, // 定值高度
    }))
  );
  return segmentList;
};
