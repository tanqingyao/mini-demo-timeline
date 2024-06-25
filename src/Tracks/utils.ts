import { PaintInfo } from './components/Rectangle';
import { SegmentInfo } from './store/core';

/** 每帧宽度 px（按时间轴缩放变化） */
export const FrameWidth = 10;

/** 帧率 */
export const FPS = 30;

/** 时间戳单位ms */
export const TimeUnit = 1_000;

/** 单轨高度 */
export const TrackHeight = 50;

/** 长度 pos 按 cellWidth 取整 */
const snapPosition = (pos: number, cellWidth: number) =>
  Math.round(pos / cellWidth) * cellWidth;

/** 长度 pos 按帧数取整 */
export const round2Frame = (x: number) => snapPosition(x, FrameWidth);

/** 将时间戳转化为帧宽度 */
const timestamp2pixel = (timestamp: number) =>
  (timestamp / TimeUnit) * FPS * FrameWidth;

/** 将帧宽度（像素）转化为时间戳 */
const pixel2timestamp = (position: number) =>
  (round2Frame(position) * TimeUnit) / FPS / FrameWidth;

/** 长度转为帧数 */
// const unit2Frame = (pos: number) => Math.round(pos / FrameWidth);

/** 视图数据格式化为草稿 */
export const formatPaintInfo2SegmentInfo = (
  paintInfo: PaintInfo
): SegmentInfo => {
  return {
    id: paintInfo.id,
    type: paintInfo.type,
    trackRenderIndex: paintInfo.y / (TrackHeight * 1.2),
    targetTimeRange: {
      start: pixel2timestamp(paintInfo.x),
      duration: pixel2timestamp(paintInfo.width),
    },
  };
};

/** 草稿解析为视图数据 */
export const parseSegmentInfo2PaintInfo = (
  segment: SegmentInfo
): PaintInfo => ({
  id: segment.id,
  type: segment.type,
  fill: segment.type === 'segment-video' ? '#f00' : '#00f',
  x: timestamp2pixel(segment.targetTimeRange.start),
  y: segment.trackRenderIndex * (TrackHeight * 1.2),
  width: timestamp2pixel(segment.targetTimeRange.duration),
  height: TrackHeight, // 定值高度
});
