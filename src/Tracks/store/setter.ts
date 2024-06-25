import { produce } from 'immer';
import { formatPaintInfo2SegmentInfo } from '../utils';
import { type PaintInfo } from '../components/Rectangle';
import { useTimelineStore } from '.';

const get = useTimelineStore.getState;
const set = useTimelineStore.setState;

export const updateSegment = (paintInfo: PaintInfo) => {
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
};
