/**
 * 业务错误码枚举
 *
 * 约定：
 *   0xxx — 通用
 *   1xxx — 用户/认证
 *   2xxx — 健康打卡
 *   3xxx — 饮食
 *   9xxx — 系统内部
 */
const ERROR = {
  // 通用
  SUCCESS:              { code: 0,     message: '成功' },
  UNKNOWN_ERROR:        { code: 1,     message: '未知错误' },
  PARAM_INVALID:        { code: 2,     message: '参数无效' },
  NOT_FOUND:            { code: 3,     message: '资源不存在' },
  METHOD_NOT_ALLOWED:   { code: 4,     message: '请求方法不允许' },

  // 用户 / 认证
  TOKEN_MISSING:        { code: 1001,  message: '缺少 Token' },
  TOKEN_EXPIRED:        { code: 1002,  message: 'Token 已过期' },
  TOKEN_INVALID:        { code: 1003,  message: 'Token 无效' },
  USER_NOT_FOUND:       { code: 1010,  message: '用户不存在' },
  CODE_INVALID:         { code: 1011,  message: '登录 code 无效' },

  // 健康打卡
  RECORD_EXISTS:        { code: 2001,  message: '当天已打卡' },
  RECORD_NOT_FOUND:     { code: 2002,  message: '打卡记录不存在' },
  SAVE_FAILED:          { code: 2003,  message: '记录保存失败' },

  // 饮食
  FOOD_NOT_FOUND:       { code: 3001,  message: '食物不存在' },
  ENTRY_SAVE_FAILED:    { code: 3002,  message: '饮食记录保存失败' },

  // 系统内部
  DB_ERROR:             { code: 9001,  message: '数据库操作失败' },
  INTERNAL_ERROR:       { code: 9999,  message: '服务器内部错误' },
};

module.exports = { ERROR };