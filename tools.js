/*
 * 工具清单 —— 唯一数据源
 * 首页（徐）与 /pgh/（彭高红）共用本文件。
 * 增删工具只需改这里一处，两人首页同步更新。
 *   name : 工具名
 *   desc : 副标题说明
 *   url  : 跳转地址
 *   icon : <svg viewBox="0 0 24 24"> 内部的线条路径
 */
window.TOOLS = [
  {
    name: '案件管理',
    desc: '案件台账 · 跟进日期 · 一键拨号',
    url: 'https://xujia521.github.io/case-manager/',
    icon: '<rect x="3.5" y="7" width="17" height="13" rx="2"/><path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7"/>'
  },
  {
    name: '利息计算器',
    desc: '计算逾期利息',
    url: 'https://xujia521.github.io/lixi/',
    icon: '<line x1="18" y1="6" x2="6" y2="18"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>'
  },
  {
    name: '加班费计算器',
    desc: '工作日 / 休息日 / 法定假',
    url: 'https://xujia521.github.io/overtime-pay-calculator/',
    icon: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>'
  },
  {
    name: '工伤赔偿计算器',
    desc: '深圳 · 伤残1-10级及治疗期待遇',
    url: 'https://xujia521.github.io/gongshang/',
    icon: '<path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"/><path d="M9 11.5l2 2 4-4.5"/>'
  },
  {
    name: '长截图裁剪',
    desc: '证据打印分页',
    url: 'https://xujia521.github.io/caijian/',
    icon: '<path d="M6.5 3v11.5a2 2 0 0 0 2 2H20"/><path d="M3 6.5h11.5a2 2 0 0 1 2 2V20"/>'
  },
  {
    name: '便签',
    desc: '轻量记录',
    url: 'https://xujia521.github.io/bianqian/',
    icon: '<path d="M5 4.5h14v10l-4.5 4.5H5z"/><path d="M19 14.5h-4.5V19"/><path d="M8 9h8M8 12.5h5"/>'
  },
  {
    name: '诉讼费用计算',
    desc: '多项费用汇总',
    url: 'https://xujia521.github.io/fee/',
    icon: '<path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z"/><path d="M9 8h6M9 11.5h6M9 15h4"/>'
  }
];
