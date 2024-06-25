/** 每帧宽度 px（按时间轴缩放变化） */
export const FrameWidth = 10;

/** 帧率 */
export const FPS = 30;

/** 时间戳单位ms */
export const TimeUnit = 1_000;

/** 单轨高度 */
export const TrackHeight = 50;

/** 将时间戳转化为帧宽度 */
export const timestamp2pixel = (timestamp: number) =>
  (timestamp / TimeUnit) * FPS * FrameWidth;

/** 长度转为帧数 */
export const unit2Frame = (pos: number) => Math.round(pos / FrameWidth);

/** 长度 pos 按 cellWidth 取整 */
export const snapPosition = (pos: number, cellWidth: number) =>
  Math.round(pos / cellWidth) * cellWidth;

/** 长度 pos 按帧数取整 */
export const round2Frame = (x: number) => snapPosition(x, FrameWidth);
