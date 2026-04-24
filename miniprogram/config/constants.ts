/** 底部 TabBar 页码索引 */
export const TAB_INDEX = {
  HOME: 0,
  CHECKIN: 1,
  CALORIE: 2,
  HISTORY: 3,
  STATS: 4,
} as const;

/** 通用 HTTP 业务状态码 */
export const API_CODE = {
  SUCCESS: 0,
  ERROR: -1,
} as const;

/** 心情选项 */
export const MOOD_OPTIONS = [
  { val: '😄', label: '开心' },
  { val: '😊', label: '平静' },
  { val: '😐', label: '一般' },
  { val: '😔', label: '低落' },
  { val: '😤', label: '烦躁' },
] as const;

/** 健康状态选项 */
export const STATUS_OPTIONS = [
  { val: '健康', emoji: '💚' },
  { val: '发热/感冒', emoji: '🤒' },
  { val: '头痛/疲劳', emoji: '😵' },
  { val: '其他不适', emoji: '😟' },
] as const;

/** 餐次选项 */
export const MEAL_OPTIONS = [
  { val: '早餐', icon: '🌅' },
  { val: '午餐', icon: '🌤️' },
  { val: '晚餐', icon: '🌙' },
  { val: '加餐', icon: '🍎' },
] as const;

/** 星期标签 */
export const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日'] as const;