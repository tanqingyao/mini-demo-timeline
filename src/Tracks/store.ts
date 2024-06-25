import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { produce } from 'immer';
import {
  formatPaintInfo2SegmentInfo,
  parseSegmentInfo2PaintInfo,
} from './utils';
import { type PaintInfo } from './components/Rectangle';

export type SegmentInfo = {
  id: string;
  type: string;
  trackRenderIndex: number;
  targetTimeRange: {
    start: number;
    duration: number;
  };
};
export type TrackInfo = {
  id: string;
  type: string;
  segments: SegmentInfo[];
};
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
  ] as unknown as TrackInfo[],
};

export const useTimelineStore = create(
  combine(initialStates, (set, get) => ({
    updateSegment(paintInfo: PaintInfo) {
      const segmentInfo = formatPaintInfo2SegmentInfo(paintInfo);
      set((store) =>
        produce(store, (draft) => {
          draft.tracks.forEach((track) => {
            const targetSegment = track.segments.find(
              (seg) => paintInfo.id === seg.id
            );
            if (targetSegment) {
              targetSegment.targetTimeRange = segmentInfo.targetTimeRange;
              targetSegment.trackRenderIndex = segmentInfo.trackRenderIndex;
            }
          });
        })
      );
    },
  }))
);

export const useSegmentList = () => {
  const tracksInfo = useTimelineStore((store) => store.tracks);
  const segmentList = tracksInfo.flatMap((track) =>
    track.segments.map(parseSegmentInfo2PaintInfo)
  );
  return segmentList;
};
