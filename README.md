# 法律工具集

徐嘉律师的个人法律工具集，部署于 GitHub Pages：<https://xujia521.github.io>

纯静态页面，无后端、无统计、无广告，所有数据只保存在使用者自己的浏览器里。

## 工具列表

| 工具 | 说明 | 代码位置 |
| --- | --- | --- |
| 案件管理 | 在办案件台账、跟进日期、一键拨打承办人电话 | 本仓库 `case-manager/` |
| 利息计算器 | 计算逾期利息 | [lixi](https://github.com/XuJia521/lixi) 仓库 |
| 加班费计算器 | 工作日 / 休息日 / 法定假 | [overtime-pay-calculator](https://github.com/XuJia521/overtime-pay-calculator) 仓库 |
| 工伤赔偿计算器 | 深圳 · 伤残1-10级及治疗期待遇 | 本仓库 `gongshang/` |
| 长截图裁剪 | 证据打印分页 | [caijian](https://github.com/XuJia521/caijian) 仓库 |
| 便签 | 轻量记录 | [bianqian](https://github.com/XuJia521/bianqian) 仓库 |
| 诉讼费用计算 | 多项费用汇总 | [fee](https://github.com/XuJia521/fee) 仓库 |

## 目录结构

```
index.html / home.js / tools.js / style.css   首页（工具入口列表）
sw.js / manifest.json                          PWA 离线缓存与安装配置
about/                                         律师简介与联系方式
case-manager/                                  案件管理（在办案件台账）
gongshang/                                     工伤赔偿计算器
accident/                                      交通事故赔偿计算器（未在首页上架）
pgh/                                           彭高红版首页（共用 tools.js 工具清单）
```

增删首页工具只需修改 `tools.js` 一处；改动 `tools.js`、`style.css` 等被缓存的文件后，需同步把 `sw.js` 里的 `CACHE_NAME` 版本号 +1，否则老用户看不到更新。

## 开发与发布流程

1. 修改在 feature 分支上进行，完成后创建 Pull Request
2. 在 GitHub 上打开 PR 页面，检查改动，点击 **Merge pull request** 合并
3. 合并后 GitHub Pages 自动部署，约 1～2 分钟生效，无需其他操作

### 怎么确认改动有没有上线

- **PR 是否已合并**：PR 页面顶部显示紫色 `Merged` 标志即已合并；绿色 `Open` 表示还没合并；[全部 PR 列表](https://github.com/XuJia521/xujia521.github.io/pulls?q=is%3Apr)
- **main 是否包含某次修改**：看[提交历史](https://github.com/XuJia521/xujia521.github.io/commits/main)，最近的合并记录都在最上面
- **线上是否已更新**：合并 1～2 分钟后强制刷新页面（手机上可清一次浏览器缓存）；因为有离线缓存，已安装的 PWA 可能要打开两次才会显示新版本
