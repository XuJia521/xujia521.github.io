/*
 * 首页渲染逻辑 —— 徐 / 彭 共用本文件。
 * 读取 window.PROFILE（个人署名）与 window.TOOLS（工具清单）渲染页面。
 * 每个 index.html 只需在引入本文件前设置好 window.PROFILE。
 */
(function () {
  var P = window.PROFILE || {};
  var T = window.TOOLS || [];

  // ── 头部署名 ──
  if (P.pageTitle) document.title = P.pageTitle;

  var sealEl = document.getElementById('seal');
  if (sealEl) sealEl.textContent = P.seal || '';

  var titleEl = document.getElementById('title');
  if (titleEl) titleEl.textContent = P.title || '法律工具';

  var subEl = document.getElementById('subtitle');
  if (subEl) {
    if (P.subtitle) { subEl.textContent = P.subtitle; subEl.style.display = ''; }
    else { subEl.style.display = 'none'; }
  }

  var footEl = document.getElementById('footer');
  if (footEl) {
    if (P.footer) { footEl.innerHTML = P.footer; footEl.style.display = ''; }
    else { footEl.style.display = 'none'; }
  }

  // ── 工具列表 ──
  var nav = document.getElementById('toolList');
  if (nav) {
    nav.innerHTML = T.map(function (t, i) {
      var delay = (0.05 * (i + 1)).toFixed(2);
      return '<a class="tool" href="' + t.url + '" style="animation-delay:' + delay + 's">' +
        '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24">' + t.icon + '</svg></span>' +
        '<div class="tool-text">' +
        '<div class="tool-name">' + t.name + '</div>' +
        '<div class="tool-desc">' + t.desc + '</div>' +
        '</div>' +
        '<span class="arrow">›</span></a>';
    }).join('');
  }

  var cnt = document.getElementById('toolCount');
  if (cnt) cnt.textContent = '共 ' + T.length + ' 项工具';

  // ── Service Worker（绝对路径，子目录页面同样适用）──
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (err) {
        console.warn('SW 注册失败:', err);
      });
    });
  }

  // ── 安卓安装提示 ──
  var deferredPrompt = null;
  var banner = document.getElementById('installBanner');
  var installBtn = document.getElementById('installBtn');
  var closeBtn = document.getElementById('installClose');

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (banner && localStorage.getItem('install-dismissed') !== '1') {
      banner.classList.add('show');
    }
  });

  if (installBtn) installBtn.addEventListener('click', async function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (banner) banner.classList.remove('show');
  });

  if (closeBtn) closeBtn.addEventListener('click', function () {
    if (banner) banner.classList.remove('show');
    localStorage.setItem('install-dismissed', '1');
  });

  window.addEventListener('appinstalled', function () {
    if (banner) banner.classList.remove('show');
  });
})();
