import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export type SegmentInfo = {
  id: string;
  type: string;
  trackRenderIndex: number;
  targetTimeRange: {
    start: number;
    duration: number;
  };
  updateTime?: number; // using timestamp forceUpdate react
};
export type TrackInfo = {
  id: string;
  type: string;
  trackIndex: number;
  segments: SegmentInfo[];
};
const _draft = {
  tracks: [
    {
      id: 'track-0',
      type: 'video',
      trackIndex: 0,
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
      trackIndex: 1,
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

const initialStates = {
  segments: _draft.tracks.flatMap((track) => track.segments),
};

/** 轨道视图模型 */
export const useTimelineStore = create(
  combine(initialStates, (set, get) => ({
    getTracksIndex: () => {
      const trackRenderIndexArray = [
        ...new Set(get().segments.map((x) => x.trackRenderIndex)),
      ];
      return trackRenderIndexArray;
    },
  }))
);

(window as any).__debugger__ = useTimelineStore;
