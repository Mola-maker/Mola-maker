import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const png = await readFile(path.join(root, 'assets/oc-headphones-guitar.png'));
const portraitRatio = png.readUInt32BE(16) / png.readUInt32BE(20);
const portrait = `data:image/png;base64,${png.toString('base64')}`;
const xml = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' }[c]));
const wave = (t, period, amount, phase = 0) => Math.sin(2 * Math.PI * t / period + phase) * amount;

/** The same scene produces animated SVG, a still fallback and raster animation frames. */
export function scene({ mobile = false, animate = true, time = 0 } = {}) {
  const w = mobile ? 720 : 1280;
  const h = mobile ? 880 : 600;
  const characterH = mobile ? 600 : 556;
  const characterW = characterH * portraitRatio;
  const characterX = mobile ? w - characterW - 12 : w - characterW - 40;
  const characterY = mobile ? 260 : 28;
  const motion = (dx, dy, duration, phase = 0) => animate
    ? `<animateTransform attributeName="transform" type="translate" values="0 0;${dx} ${dy};0 0" dur="${duration}s" begin="-${phase}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1"/>`
    : '';
  const drift = (dx, dy, duration, phase = 0) => animate ? 'translate(0 0)' : `translate(${wave(time + phase, duration, dx / 2) + dx / 2} ${wave(time + phase, duration, dy / 2) + dy / 2})`;
  const cloud = (x, y, scale, paint, opacity, dx, dy, duration, phase) => `<g transform="translate(${x} ${y}) scale(${scale})"><g transform="${drift(dx,dy,duration,phase)}">${motion(dx,dy,duration,phase)}<path d="M-300 110 C-230 75-170 100-110 75 C-100 25-35 18 15 53 C80 2 180 0 235 48 C310 11 395 38 408 80 C490 57 590 75 640 112 C730 88 850 110 940 144 L960 260 L-320 260Z" fill="${paint}" opacity="${opacity}" filter="url(#cloud-soft)"/><path d="M-220 138 C-120 130-45 115 25 118 C120 70 195 80 265 120 C355 88 445 120 520 134 C640 114 770 142 900 152 L900 228 L-220 228Z" fill="#fff4fc" opacity="${opacity * .46}" filter="url(#cloud-wisp)"/></g></g>`;
  const clouds = [
    cloud(-30, mobile?42:8, .88, 'url(#blue-cloud)', .66, 70, 8, 24, 4),
    cloud(w*.47, mobile?120:92, .67, 'url(#pink-cloud)', .82, -54, -5, 12, 6),
    cloud(-120, h*.46, 1.1, 'url(#pink-cloud)', .70, 55, 10, 24, 10),
    cloud(w*.62, h*.48, .82, 'url(#blue-cloud)', .57, -66, 4, 24, 2),
    cloud(w*.18, h*.76, 1.05, 'url(#pink-cloud)', .74, -50, -7, 24, 8),
  ].join('');
  const bob = animate ? 0 : wave(time, 6, 4);
  const notes = [[mobile?255:820,mobile?330:162,'♪',12],[mobile?330:787,mobile?485:277,'♫',12]];
  const noteMarkup = notes.map(([x,y,text,duration],i) => `<g opacity=".5" transform="translate(${x} ${y})"><g transform="${drift(12,-18,duration,i*2)}">${motion(12,-18,duration,i*2)}<text font-family="Georgia,serif" font-size="${i?28:36}" fill="#5e86bc">${text}</text></g></g>`).join('');
  const titleX = mobile?48:82;
  const titleY = mobile?124:236;
  const content = `<text x="${titleX}" y="${mobile?45:134}" fill="#426389" font-family="ui-monospace,monospace" font-size="${mobile?17:18}" letter-spacing="3">MOLAMAKER / A LITTLE SIGNAL</text>
    <text x="${titleX}" y="${titleY}" fill="#22436f" font-family="Georgia,serif" font-size="${mobile?76:90}" font-weight="600">Hi, I'm mola.</text>
    <text x="${titleX+2}" y="${titleY+54}" fill="#3f5c84" font-family="Arial,sans-serif" font-size="${mobile?26:30}">Somewhere between a signal</text>
    <text x="${titleX+2}" y="${titleY+92}" fill="#3f5c84" font-family="Arial,sans-serif" font-size="${mobile?26:30}">&amp; a daydream.</text>
    ${mobile?'':`<text x="${titleX+2}" y="${titleY+160}" fill="#456b95" font-family="Arial,sans-serif" font-size="21">COMMUNICATION ENGINEERING · AGENTS · AI INFRA</text>`}`;
  const eqX = mobile?66:84;
  const eqY = mobile?h-79:h-101;
  const equalizer = Array.from({length:17},(_,i) => {
    const height = 11 + (i%5)*6;
    const period = [1.2,1.5,2,3][i%4];
    const factor = animate ? 1 : .45+.55*(1+Math.sin(2*Math.PI*time/period+i*.65))/2;
    return `<g transform="translate(${eqX+i*10} ${eqY})"><rect x="0" y="${-height}" width="4" height="${height}" rx="2" fill="#6087b8" opacity=".66" transform="scale(1 ${factor})">${animate?`<animateTransform attributeName="transform" type="scale" values="1 .45;1 1;1 .45" dur="${period}s" begin="-${i*.12}s" repeatCount="indefinite"/>`:''}</rect></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
    <title id="title">mola — headphones, guitar and a pastel evening sky</title>
    <desc id="desc">The original blue-haired OC wears headphones and carries a guitar on her back. Pink and blue evening clouds drift slowly across a light blue sky.${animate?' Animated clouds, gentle character motion, music notes and equalizer.':' Still version.'}</desc>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2=".12" y2="1"><stop stop-color="#abd7f5"/><stop offset=".48" stop-color="#dceeff"/><stop offset="1" stop-color="#fbe0ed"/></linearGradient>
      <linearGradient id="pink-cloud" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f1b9d9" stop-opacity=".48"/><stop offset=".42" stop-color="#f8cde5"/><stop offset="1" stop-color="#e0ceef" stop-opacity=".12"/></linearGradient>
      <linearGradient id="blue-cloud" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#9cbee8" stop-opacity=".1"/><stop offset=".54" stop-color="#b7d3f3"/><stop offset="1" stop-color="#e6e7fa" stop-opacity=".2"/></linearGradient>
      <radialGradient id="glow"><stop stop-color="#fff5e8" stop-opacity=".72"/><stop offset="1" stop-color="#fff5e8" stop-opacity="0"/></radialGradient>
      <filter id="cloud-soft" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>
      <filter id="cloud-wisp" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="8"/></filter>
      <clipPath id="clip"><rect width="${w}" height="${h}" rx="22"/></clipPath>
    </defs>
    <g clip-path="url(#clip)"><rect width="${w}" height="${h}" fill="url(#sky)"/>
    <ellipse cx="${w*.69}" cy="${h*.36}" rx="${w*.43}" ry="${h*.48}" fill="url(#glow)"/>
    ${clouds}${content}${noteMarkup}
    <g transform="translate(0 ${bob})">${animate?'<animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1"/>':''}
      <image x="${characterX}" y="${characterY}" width="${characterW}" height="${characterH}" href="${portrait}"/>
    </g>${equalizer}
    <text x="${eqX}" y="${eqY+30}" fill="#527399" font-size="${mobile?15:17}" font-family="Arial,sans-serif" letter-spacing="2">KEEP A LITTLE NIGHT.</text>
    </g></svg>`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await mkdir(path.join(root,'assets'),{recursive:true});
  for (const [name,options] of Object.entries({
    'hero.svg':{}, 'hero-mobile.svg':{mobile:true},
    'hero-still.svg':{animate:false}, 'hero-mobile-still.svg':{mobile:true,animate:false},
  })) {
    await writeFile(path.join(root,'assets',name),scene(options));
    console.log(`Built assets/${xml(name)}`);
  }
}
