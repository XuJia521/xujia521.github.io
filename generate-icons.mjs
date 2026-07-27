// 图标生成脚本：node generate-icons.mjs
// 由一份天平图形生成三种变体（圆角 / 满幅 / maskable），再用 sharp 输出各尺寸 PNG
import sharp from 'sharp';
import { writeFileSync } from 'fs';

// 渐变、滤镜等公共定义
const DEFS = `
  <defs>
    <!-- 背景：祖母绿对角渐变 -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a5c45"/>
      <stop offset="55%" stop-color="#153826"/>
      <stop offset="100%" stop-color="#0a2117"/>
    </linearGradient>
    <!-- 左上环境光 -->
    <radialGradient id="bgGlow" cx="38%" cy="28%" r="62%">
      <stop offset="0%" stop-color="#4d8a6c" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#4d8a6c" stop-opacity="0"/>
    </radialGradient>
    <!-- 天平身后的金色辉光，把主体从深底里衬出来 -->
    <radialGradient id="haloGlow" cx="50%" cy="47%" r="42%">
      <stop offset="0%" stop-color="#f0c460" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#f0c460" stop-opacity="0"/>
    </radialGradient>
    <!-- 四周暗角，增加纵深 -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
      <stop offset="62%" stop-color="#03110a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#03110a" stop-opacity="0.4"/>
    </radialGradient>
    <!-- 金色主渐变（三段，更有金属感） -->
    <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f6d97e"/>
      <stop offset="55%" stop-color="#ddad49"/>
      <stop offset="100%" stop-color="#a2751e"/>
    </linearGradient>
    <!-- 金色高光（顶面/边缘） -->
    <linearGradient id="goldHi" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffefb0"/>
      <stop offset="100%" stop-color="#e9bd55"/>
    </linearGradient>
    <!-- 秤盘碗身：上亮下深 -->
    <linearGradient id="bowl" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e9bd55"/>
      <stop offset="100%" stop-color="#8f6316"/>
    </linearGradient>
    <!-- 整体投影 -->
    <filter id="shadow" x="-20%" y="-15%" width="140%" height="140%">
      <feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#03110a" flood-opacity="0.5"/>
    </filter>
  </defs>`;

// 天平主体（512 视野，中轴 x=256）
const SCALES = `
  <g filter="url(#shadow)">
    <!-- 顶部圆球 -->
    <circle cx="256" cy="100" r="17" fill="url(#gold)"/>
    <circle cx="250" cy="93" r="6" fill="#ffefb0" opacity="0.75"/>

    <!-- 立柱 -->
    <rect x="248" y="114" width="16" height="244" rx="5" fill="url(#gold)"/>
    <rect x="250" y="114" width="4" height="244" rx="2" fill="url(#goldHi)" opacity="0.55"/>

    <!-- 横梁 -->
    <rect x="128" y="148" width="256" height="16" rx="8" fill="url(#gold)"/>
    <rect x="128" y="148" width="256" height="5" rx="2.5" fill="url(#goldHi)" opacity="0.55"/>
    <!-- 梁端圆球 -->
    <circle cx="132" cy="156" r="10" fill="url(#goldHi)"/>
    <circle cx="380" cy="156" r="10" fill="url(#goldHi)"/>

    <!-- 左侧 V 形挂链 -->
    <path d="M 132,164 L 90,246 M 132,164 L 174,246" stroke="url(#gold)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- 右侧 V 形挂链 -->
    <path d="M 380,164 L 338,246 M 380,164 L 422,246" stroke="url(#gold)" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>

  <!-- 左秤盘 -->
  <g filter="url(#shadow)">
    <path d="M 74,250 A 58 42 0 0 0 190,250 Z" fill="url(#bowl)"/>
    <rect x="66" y="242" width="132" height="14" rx="7" fill="url(#goldHi)"/>
  </g>
  <!-- 右秤盘 -->
  <g filter="url(#shadow)">
    <path d="M 322,250 A 58 42 0 0 0 438,250 Z" fill="url(#bowl)"/>
    <rect x="314" y="242" width="132" height="14" rx="7" fill="url(#goldHi)"/>
  </g>

  <!-- 阶梯式底座 -->
  <g filter="url(#shadow)">
    <path d="M 234,350 L 278,350 L 294,382 L 218,382 Z" fill="url(#gold)"/>
    <rect x="206" y="380" width="100" height="15" rx="5" fill="url(#gold)"/>
    <rect x="206" y="380" width="100" height="5" rx="2.5" fill="url(#goldHi)" opacity="0.5"/>
    <rect x="178" y="393" width="156" height="19" rx="8" fill="url(#gold)"/>
    <rect x="178" y="393" width="156" height="6" rx="3" fill="url(#goldHi)" opacity="0.45"/>
  </g>`;

// variant: 'rounded' 圆角（favicon / any 图标）
//          'full'    满幅方形（apple-touch-icon，iOS 自行裁圆角）
//          'mask'    满幅 + 主体缩进安全区（maskable）
function buildSvg(variant) {
  const rx = variant === 'rounded' ? 112 : 0;
  const motif = variant === 'mask'
    ? `<g transform="translate(56.32 56.32) scale(0.78)">${SCALES}</g>`
    : SCALES;
  // 圆角版内侧加一圈金色细边；满幅版四角会被系统裁掉，不加
  const rim = variant === 'rounded'
    ? `<rect x="7" y="7" width="498" height="498" rx="105" fill="none" stroke="#f0c460" stroke-opacity="0.22" stroke-width="3"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
${DEFS}
  <rect width="512" height="512" rx="${rx}" fill="url(#bg)"/>
  <rect width="512" height="512" rx="${rx}" fill="url(#bgGlow)"/>
  <rect width="512" height="512" rx="${rx}" fill="url(#haloGlow)"/>
${motif}
  <rect width="512" height="512" rx="${rx}" fill="url(#vignette)"/>
${rim}
</svg>
`;
}

const rounded = buildSvg('rounded');
const full = buildSvg('full');
const mask = buildSvg('mask');

writeFileSync('icon.svg', rounded);

const jobs = [
  [rounded, 512, 'icon-512.png'],
  [rounded, 192, 'icon-192.png'],
  [rounded, 32, 'favicon-32.png'],
  [rounded, 16, 'favicon-16.png'],
  [full, 180, 'apple-touch-icon.png'],
  [mask, 512, 'icon-maskable-512.png'],
  [mask, 192, 'icon-maskable-192.png'],
];

for (const [svg, size, file] of jobs) {
  await sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toFile(file);
  console.log('生成', file);
}
