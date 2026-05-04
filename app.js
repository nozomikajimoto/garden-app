const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const TYPE_LABELS = { evergreen:'常緑', deciduous:'落葉', annual:'一年草', perennial:'宿根草' };
const CURRENT_MONTH = new Date().getMonth() + 1;
const STORAGE_KEY = 'garden-plants-v3';

// 千葉県基準の初期植物データ
// 開花時期は筑波実験植物園図鑑（https://tbg.kahaku.go.jp/recommend/illustrated/）を参考
const SEED_DATA = [
  // --- 2024年以前 ---
  { name:'アナベル', type:'deciduous', bloomingMonths:[6,7,8], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[3,9], pruningMonths:[2,3], notes:'アジサイ系落葉低木・白大輪' },
  { name:'モッコウバラ', type:'evergreen', bloomingMonths:[4,5], leafMonths:[], fertilizerMonths:[1,5,9], pruningMonths:[5,6], notes:'常緑つる性・一季咲き・トゲなし' },
  // --- 2025春 ---
  { name:'シモツケ ホワイトゴールド', type:'deciduous', bloomingMonths:[5,6,7,8,9,10,11], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[3,9], pruningMonths:[7,8], notes:'耐寒性落葉低木', url:'https://tbg.kahaku.go.jp/recommend/illustrated/result.php?p=1&mode=easy&order=staff&name=%E3%82%B7%E3%83%A2%E3%83%84%E3%82%B1' },
  { name:'芝桜', type:'evergreen', bloomingMonths:[3,4,5], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[5,6], notes:'' },
  { name:'カーペットカスミソウ', type:'perennial', bloomingMonths:[5,6,7], leafMonths:[3,4,5,6,7,8,9,10,11], fertilizerMonths:[4,9], pruningMonths:[7], notes:'' },
  { name:'スーパーアリッサム アイシクルナイト', type:'annual', bloomingMonths:[3,4,5,6,9,10,11], leafMonths:[2,3,4,5,6,9,10,11,12], fertilizerMonths:[3,10], pruningMonths:[5,6], notes:'' },
  { name:'アンティリス レッドカーペット', type:'perennial', bloomingMonths:[4,5,6,7], leafMonths:[3,4,5,6,7,8,9,10], fertilizerMonths:[4,9], pruningMonths:[6], notes:'' },
  { name:'オダマキ', type:'perennial', bloomingMonths:[4,5,6], leafMonths:[3,4,5,6,7,9,10,11], fertilizerMonths:[3,9], pruningMonths:[6], notes:'' },
  { name:'エレモフィラ・ディシピエンス', type:'evergreen', bloomingMonths:[3,4,5], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[5,6], notes:'常緑低木' },
  { name:'リナリア まろんパレット', type:'annual', bloomingMonths:[3,4,5], leafMonths:[2,3,4,5], fertilizerMonths:[3,4], pruningMonths:[5], notes:'' },
  { name:'オキナソウ', type:'perennial', bloomingMonths:[3,4], leafMonths:[3,4,5,6,7], fertilizerMonths:[3,9], pruningMonths:[], notes:'' },
  { name:'フェイジョア', type:'evergreen', bloomingMonths:[5,6], leafMonths:[], fertilizerMonths:[3,6,9], pruningMonths:[2,3], notes:'常緑低木' },
  { name:'つるバラ 真白', type:'deciduous', bloomingMonths:[5], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[1,5,9], pruningMonths:[12,1,2], notes:'一季咲き' },
  { name:'トケイソウ', type:'deciduous', bloomingMonths:[6,7,8,9,10], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[4,7,9], pruningMonths:[2,3], notes:'半常緑（千葉では落葉扱い）' },
  { name:'クレマチス・ペトリエイ', type:'evergreen', bloomingMonths:[3,4,5], leafMonths:[], fertilizerMonths:[2,5,9], pruningMonths:[5,6], notes:'常緑・早咲き種' },
  { name:'クライミング サンパラソル', type:'annual', bloomingMonths:[6,7,8,9,10], leafMonths:[5,6,7,8,9,10,11], fertilizerMonths:[5,6,7,8,9], pruningMonths:[3,4], notes:'非耐寒性（日本では一年草扱い）' },
  { name:'ローズマリー マジョルカピンク', type:'evergreen', bloomingMonths:[3,4,5], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[5,6], notes:'立性' },
  { name:'レモンバーム', type:'perennial', bloomingMonths:[6,7,8], leafMonths:[3,4,5,6,7,8,9,10,11], fertilizerMonths:[3,9], pruningMonths:[6,10], notes:'' },
  { name:'ブーゲンビリア', type:'evergreen', bloomingMonths:[5,6,7,8,9,10], leafMonths:[], fertilizerMonths:[4,7,10], pruningMonths:[3,4], notes:'非耐寒性（要冬越し）' },
  { name:'サルビア（青）', type:'annual', bloomingMonths:[6,7,8,9,10,11], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[4,7,9], pruningMonths:[7,9], notes:'' },
  { name:'サルビア（白）', type:'annual', bloomingMonths:[6,7,8,9,10,11], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[4,7,9], pruningMonths:[7,9], notes:'' },
  { name:'ハゴロモジャスミン', type:'evergreen', bloomingMonths:[3,4,5], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[5,6], notes:'常緑つる性' },
  { name:'パッションフルーツ', type:'perennial', bloomingMonths:[6,7,8,9], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[4,7,9], pruningMonths:[2,3], notes:'非耐寒性（要冬越し）' },
  // --- 2025夏 ---
  { name:'コブミカン', type:'evergreen', bloomingMonths:[4,5], leafMonths:[], fertilizerMonths:[3,6,9], pruningMonths:[3,4], notes:'' },
  { name:'アロニア', type:'deciduous', bloomingMonths:[4,5], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[3,9], pruningMonths:[12,1,2], notes:'秋に紅葉・黒い実' },
  { name:'ミソハギ', type:'perennial', bloomingMonths:[7,8,9], leafMonths:[5,6,7,8,9,10], fertilizerMonths:[3,9], pruningMonths:[11,3], notes:'', url:'https://tbg.kahaku.go.jp/recommend/illustrated/result.php?p=1&mode=easy&order=staff&name=%E3%83%9F%E3%82%BD%E3%83%8F%E3%82%AE' },
  { name:'レモングラス', type:'annual', bloomingMonths:[], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[4,7], pruningMonths:[4,10], notes:'非耐寒性（日本では一年草扱い）' },
  { name:'ネコノヒゲ', type:'annual', bloomingMonths:[7,8,9,10], leafMonths:[5,6,7,8,9,10,11], fertilizerMonths:[5,7,9], pruningMonths:[7,9], notes:'非耐寒性（日本では一年草扱い）' },
  { name:'センニチコウ', type:'annual', bloomingMonths:[6,7,8,9,10,11], leafMonths:[5,6,7,8,9,10,11], fertilizerMonths:[6,8,10], pruningMonths:[], notes:'' },
  // --- 2025秋 ---
  { name:'ウィンターコスモス', type:'annual', bloomingMonths:[9,10,11,12], leafMonths:[4,5,6,7,8,9,10,11,12], fertilizerMonths:[4,9], pruningMonths:[8], notes:'秋〜冬咲き' },
  { name:'ノリウツギ マキシ ファイヤーライト', type:'deciduous', bloomingMonths:[6,7,8], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[3,9], pruningMonths:[12,1,2], notes:'秋に花色が変化', url:'https://tbg.kahaku.go.jp/recommend/illustrated/result.php?p=1&mode=easy&order=staff&name=%E3%83%8E%E3%83%AA%E3%82%A6%E3%83%84%E3%82%AE' },
  { name:'チョコレートコスモス', type:'perennial', bloomingMonths:[6,7,8,9,10,11], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[4,7,9], pruningMonths:[11,3], notes:'半耐寒性（要保護）' },
  { name:'イチジク ホワイトイスキア', type:'deciduous', bloomingMonths:[7,8,9,10], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[3,6,9], pruningMonths:[12,1,2], notes:'開花は目立たない（果実時期）' },
  { name:'サルビア レウカンサ ピンクアメジスト', type:'perennial', bloomingMonths:[9,10,11,12], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[4,9], pruningMonths:[3,4], notes:'半耐寒性宿根草' },
  { name:'オキザリス（黄色）', type:'perennial', bloomingMonths:[10,11,12,1,2,3,4], leafMonths:[9,10,11,12,1,2,3,4,5], fertilizerMonths:[9,3], pruningMonths:[5], notes:'秋〜春咲き球根' },
  { name:'アルテルナンテラ レッドフラッシュ', type:'annual', bloomingMonths:[], leafMonths:[5,6,7,8,9,10,11], fertilizerMonths:[5,7,9], pruningMonths:[7,9], notes:'葉色鑑賞（開花なし）' },
  { name:'秋明菊 八重 白', type:'perennial', bloomingMonths:[9,10,11], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[3,9], pruningMonths:[12], notes:'' },
  { name:'カレックス アマゾンミスト', type:'evergreen', bloomingMonths:[4,5], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[3], notes:'常緑多年草・葉色鑑賞' },
  // --- 2026冬 ---
  { name:'スイセン', type:'perennial', bloomingMonths:[12,1,2,3], leafMonths:[11,12,1,2,3,4,5], fertilizerMonths:[10,2], pruningMonths:[5,6], notes:'芽出し苗' },
  // --- 2026春 ---
  { name:'ユキヤナギ', type:'deciduous', bloomingMonths:[3,4], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[3,9], pruningMonths:[4,5], notes:'', url:'https://tbg.kahaku.go.jp/recommend/illustrated/result.php?p=1&mode=easy&order=staff&name=%E3%83%A6%E3%82%AD%E3%83%A4%E3%83%8A%E3%82%AE' },
  { name:'ハーデンベルギア', type:'evergreen', bloomingMonths:[2,3,4], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[4,5], notes:'常緑つる性' },
  { name:'ジンチョウゲ', type:'evergreen', bloomingMonths:[2,3,4], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[4], notes:'常緑低木' },
  { name:'ウンナンオウバイ', type:'evergreen', bloomingMonths:[2,3,4], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[4,5], notes:'半常緑' },
  { name:'ライム', type:'evergreen', bloomingMonths:[5,6], leafMonths:[], fertilizerMonths:[3,6,9], pruningMonths:[3,4], notes:'常緑低木・要冬越し保護' },
  { name:'エリカ・ホワイトデライト', type:'evergreen', bloomingMonths:[11,12,1,2,3], leafMonths:[], fertilizerMonths:[3,9], pruningMonths:[3,4], notes:'常緑低木・冬〜春咲き' },
  { name:'スペアミント', type:'perennial', bloomingMonths:[7,8,9], leafMonths:[4,5,6,7,8,9,10,11], fertilizerMonths:[4,7], pruningMonths:[5,7,9], notes:'ハーブ・地下茎で広がる' },
  { name:'アシタバ', type:'perennial', bloomingMonths:[7,8,9], leafMonths:[3,4,5,6,7,8,9,10,11], fertilizerMonths:[3,6,9], pruningMonths:[], notes:'食用ハーブ' },
  { name:'コキア', type:'annual', bloomingMonths:[], leafMonths:[5,6,7,8,9,10,11], fertilizerMonths:[5,7], pruningMonths:[], notes:'葉色鑑賞・秋に紅葉' },
  { name:'シソ', type:'annual', bloomingMonths:[8,9,10], leafMonths:[5,6,7,8,9,10], fertilizerMonths:[5,7], pruningMonths:[8], notes:'食用ハーブ・花穂を摘む' },
];

// ===== Storage =====
function loadPlants() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  const seeds = SEED_DATA.map((p, i) => ({ id: i + 1, ...p }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
  return seeds;
}

let plants = [];
let typeFilter = '';
let monthlyMonth = CURRENT_MONTH;

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  plants = loadPlants();
  buildMonthLabels();
  renderTimeline();
  renderMonthly();
  bindUI();
});

function bindUI() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
    });
  });

  document.getElementById('type-filter').addEventListener('change', e => {
    typeFilter = e.target.value;
    renderTimeline();
  });

  document.getElementById('prev-month').addEventListener('click', () => {
    monthlyMonth = monthlyMonth === 1 ? 12 : monthlyMonth - 1;
    renderMonthly();
  });
  document.getElementById('next-month').addEventListener('click', () => {
    monthlyMonth = monthlyMonth === 12 ? 1 : monthlyMonth + 1;
    renderMonthly();
  });
}

// ===== Timeline =====
function buildMonthLabels() {
  document.getElementById('month-labels').innerHTML = MONTHS.map((m, i) =>
    `<div class="month-lbl${i + 1 === CURRENT_MONTH ? ' cur' : ''}">${m}</div>`
  ).join('');
}

function cellStatus(month, plant) {
  const blooming = plant.bloomingMonths.includes(month);
  const leaf = plant.type === 'evergreen' || plant.leafMonths.includes(month);
  if (blooming && leaf) return 'both';
  if (blooming) return 'blooming';
  if (leaf) return 'leaf';
  return 'none';
}

function renderTimeline() {
  const list = typeFilter ? plants.filter(p => p.type === typeFilter) : plants;
  const empty = document.getElementById('empty-state');
  const rows = document.getElementById('plant-rows');

  if (list.length === 0) {
    rows.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  const statusLabel = { both:'開花・葉あり', blooming:'開花中', leaf:'葉あり', none:'葉なし' };

  rows.innerHTML = list.map(plant => {
    const cells = MONTHS.map((m, i) => {
      const mo = i + 1;
      const st = cellStatus(mo, plant);
      const fert = plant.fertilizerMonths.includes(mo);
      const prun = plant.pruningMonths.includes(mo);
      let tip = `${m}: ${statusLabel[st]}`;
      if (fert) tip += '／肥料';
      if (prun) tip += '／剪定';
      return `<div class="cell ${st}${mo === CURRENT_MONTH ? ' cur-month' : ''}" title="${tip}">
        ${fert ? '<span class="ind fert"></span>' : ''}
        ${prun ? '<span class="ind prun"></span>' : ''}
      </div>`;
    }).join('');

    return `<div class="plant-row">
      <div class="tl-name-col plant-name-area">
        <div class="plant-name-text" title="${esc(plant.notes)}">${plantNameHtml(plant)}</div>
        <div class="row-meta">
          <span class="badge ${plant.type}">${TYPE_LABELS[plant.type]}</span>
        </div>
      </div>
      <div class="tl-cells">${cells}</div>
    </div>`;
  }).join('');
}

// ===== Monthly =====
function renderMonthly() {
  const m = monthlyMonth;
  document.getElementById('month-display').textContent = `${m}月`;

  const blooming = plants.filter(p => p.bloomingMonths.includes(m));
  const leafOnly  = plants.filter(p => !p.bloomingMonths.includes(m) &&
    (p.type === 'evergreen' || p.leafMonths.includes(m)));
  const fert      = plants.filter(p => p.fertilizerMonths.includes(m));
  const prun      = plants.filter(p => p.pruningMonths.includes(m));

  const sections = [
    { icon:'🌸', title:'開花中',         items: blooming },
    { icon:'🌿', title:'葉あり（非開花）', items: leafOnly },
    { icon:'💧', title:'肥料の時期',      items: fert },
    { icon:'✂️', title:'剪定の時期',      items: prun },
  ];

  document.getElementById('monthly-content').innerHTML = sections.map(s => `
    <div class="monthly-section">
      <div class="monthly-section-title">
        ${s.icon} ${s.title}
        <span class="count-badge">${s.items.length}</span>
      </div>
      ${s.items.length === 0
        ? '<div class="empty-section">なし</div>'
        : `<div class="plant-chips">${s.items.map(p => `
            <div class="plant-chip">
              <span class="chip-name" title="${esc(p.notes)}">${plantNameHtml(p)}</span>
              <span class="badge ${p.type}">${TYPE_LABELS[p.type]}</span>
            </div>`).join('')}
          </div>`}
    </div>`).join('');
}

function esc(s) {
  return String(s || '').replace(/[&<>"]/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c])
  );
}

function plantNameHtml(plant) {
  const name = esc(plant.name);
  if (!plant.url) return name;
  return `<a href="${plant.url}" target="_blank" rel="noopener" class="plant-link">${name}</a>`;
}
