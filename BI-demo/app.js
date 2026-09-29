// -*- coding: utf-8 -*-

const numberFormatter = new Intl.NumberFormat('zh-CN');

const cityProjects = {
  '武汉': {
    code: 'WH', area: '3,860', staff: '1,286',
    projects: [
      ['⌂', '嘉源滨江壹号', '住宅 · 江岸区 · 68万㎡', '运行正常'],
      ['▦', '光谷金融港', '产业园 · 东湖高新 · 82万㎡', '运行正常'],
      ['◇', '武汉市民之家', '公建 · 江岸区 · 12万㎡', '重点保障'],
      ['◎', '汉口城市广场', '商业 · 江汉区 · 24万㎡', '运行正常'],
      ['♧', '东湖绿道服务区', '城市服务 · 武昌区 · 38公里', '运行正常']
    ]
  },
  '合肥': {
    code: 'HF', area: '1,460', staff: '568',
    projects: [
      ['⌂', '滨湖云谷社区', '住宅 · 滨湖新区 · 46万㎡', '运行正常'],
      ['▦', '科创产业园', '产业园 · 高新区 · 58万㎡', '运行正常'],
      ['◎', '庐州商业中心', '商业 · 庐阳区 · 19万㎡', '品质巡检']
    ]
  },
  '咸宁': {
    code: 'XN', area: '920', staff: '386',
    projects: [
      ['⌂', '温泉新城', '住宅 · 咸安区 · 35万㎡', '运行正常'],
      ['♧', '淦河城市服务', '城市服务 · 咸安区 · 22公里', '运行正常'],
      ['◇', '市民文化中心', '公建 · 咸安区 · 9万㎡', '重点保障']
    ]
  },
  '长沙': {
    code: 'CS', area: '780', staff: '294',
    projects: [
      ['⌂', '梅溪湖云著', '住宅 · 岳麓区 · 42万㎡', '运行正常'],
      ['▦', '湘江科创园', '产业园 · 岳麓区 · 51万㎡', '运行正常'],
      ['◎', '星沙商业街区', '商业 · 长沙县 · 16万㎡', '品质巡检']
    ]
  }
};

function updateClock() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).formatToParts(now).reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});
  document.querySelector('#clock').textContent = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function animateNumberElement(el, options = {}) {
  const textNode = [...el.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && /\d/.test(node.nodeValue));
  if (!textNode) return;
  const source = options.targetText ?? textNode.nodeValue;
  const match = source.match(/-?[\d,]+(?:\.\d+)?/);
  if (!match) return;
  const target = Number(match[0].replaceAll(',', ''));
  const decimals = options.decimals ?? (match[0].split('.')[1]?.length || 0);
  const prefix = source.slice(0, match.index);
  const suffix = source.slice(match.index + match[0].length);
  const duration = options.duration || 1300;
  const delay = options.delay || 0;
  const startedAt = performance.now() + delay;
  el.classList.remove('number-pop');

  const tick = (now) => {
    if (now < startedAt) {
      requestAnimationFrame(tick);
      return;
    }
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    const display = decimals
      ? value.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : numberFormatter.format(Math.round(value));
    textNode.nodeValue = `${prefix}${display}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
    else el.classList.add('number-pop');
  };
  requestAnimationFrame(tick);
}

function animateNumbers(root = document) {
  root.querySelectorAll('[data-count]').forEach((el, index) => {
    animateNumberElement(el, {
      targetText: el.dataset.count,
      decimals: Number(el.dataset.decimals || 0),
      delay: index * 70
    });
  });

  const selectors = [
    '.mini-stats strong', '.donut strong', '.response-grid strong',
    '.progress-list label > b', '.city-marker strong', '.map-summary b',
    '.quality-rings strong', '.growth-bars b', '.risk-gauge strong', '.risk-list b'
  ].join(',');
  root.querySelectorAll(selectors).forEach((el, index) => {
    animateNumberElement(el, { delay: 180 + (index % 8) * 65 });
  });
}

function renderBars() {
  const data = [
    { month: '4月', contract: 61, receipt: 47 },
    { month: '5月', contract: 76, receipt: 59 },
    { month: '6月', contract: 68, receipt: 63 },
    { month: '7月', contract: 84, receipt: 72 },
    { month: '8月', contract: 81, receipt: 69 },
    { month: '9月', contract: 90, receipt: 80 }
  ];
  document.querySelector('#bars').innerHTML = data.map((item, index) => `
    <div class="bar-group">
      <i style="--height:${item.contract}%;--delay:${index * 80}ms"></i>
      <i style="--height:${item.receipt}%;--delay:${index * 80 + 120}ms"></i>
      <span>${item.month}</span>
    </div>`).join('');
}

const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

document.querySelectorAll('.map-toolbar button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.map-toolbar button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const region = button.dataset.region;
    document.querySelectorAll('.city-marker').forEach((marker) => {
      const visible = region === '全国' ||
        (region === '华中' && ['武汉', '咸宁', '长沙'].includes(marker.dataset.city)) ||
        (region === '华东' && marker.dataset.city === '合肥');
      marker.style.opacity = visible ? '1' : '.15';
      marker.style.pointerEvents = visible ? 'auto' : 'none';
    });
    showToast(`已切换至${region}区域`);
  });
});

document.querySelectorAll('.city-marker').forEach((marker) => {
  marker.addEventListener('click', () => {
    document.querySelectorAll('.city-marker').forEach((item) => item.classList.remove('active'));
    marker.classList.add('active');
    openCityDetail(marker.dataset.city, marker.dataset.value);
    history.replaceState(null, '', `#${encodeURIComponent(marker.dataset.city)}`);
  });
});

const cityDetail = document.querySelector('#cityDetail');
const mapCanvas = document.querySelector('.map-canvas');

function openCityDetail(city, count) {
  const data = cityProjects[city];
  if (!data) return;
  document.querySelector('#detailCode').textContent = data.code;
  document.querySelector('#detailCity').textContent = city;
  document.querySelector('#detailCount').textContent = count;
  document.querySelector('#detailArea').textContent = data.area;
  document.querySelector('#detailStaff').textContent = data.staff;
  document.querySelector('#projectList').innerHTML = data.projects.map((project, index) => `
    <button class="project-item${index === 0 ? ' active' : ''}" data-project="${project[1]}" data-status="${project[3]}">
      <i>${project[0]}</i><span><b>${project[1]}</b><small>${project[2]}</small></span><em class="${project[3] === '运行正常' ? '' : 'warn'}">${project[3]}</em>
    </button>`).join('');
  cityDetail.classList.add('open');
  cityDetail.setAttribute('aria-hidden', 'false');
  mapCanvas.classList.add('detail-open');
  bindProjectItems();
  document.querySelectorAll('.detail-kpis strong').forEach((el, index) => {
    animateNumberElement(el, { delay: 180 + index * 100, duration: 900 });
  });
  showToast(`${city}项目详情已展开`);
}

function bindProjectItems() {
  document.querySelectorAll('.project-item').forEach((item) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.project-item').forEach((project) => project.classList.remove('active'));
      item.classList.add('active');
      const status = document.querySelector('#projectStatus');
      status.querySelector('span').textContent = `${item.dataset.project} · ${item.dataset.status}`;
      status.querySelector('b').textContent = '已选中';
    });
  });
}

document.querySelector('#detailClose').addEventListener('click', () => {
  cityDetail.classList.remove('open');
  cityDetail.setAttribute('aria-hidden', 'true');
  mapCanvas.classList.remove('detail-open');
  document.querySelectorAll('.city-marker').forEach((item) => item.classList.remove('active'));
  history.replaceState(null, '', window.location.pathname);
});

function openCityFromHash() {
  const city = decodeURIComponent(window.location.hash.slice(1));
  if (!cityProjects[city]) return;
  const marker = [...document.querySelectorAll('.city-marker')].find((item) => item.dataset.city === city);
  if (!marker) return;
  document.querySelectorAll('.city-marker').forEach((item) => item.classList.remove('active'));
  marker.classList.add('active');
  openCityDetail(city, marker.dataset.value);
}

window.addEventListener('hashchange', openCityFromHash);

document.querySelectorAll('.risk-list button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('#riskFilter').textContent = `${button.dataset.type}风险`;
    showToast(`已筛选${button.dataset.type}风险`);
  });
});

document.querySelector('#riskFilter').addEventListener('click', (event) => {
  event.currentTarget.textContent = '全部风险';
  showToast('已显示全部风险');
});

document.querySelectorAll('.city-services button').forEach((button) => {
  button.addEventListener('click', () => showToast(`${button.querySelector('b').textContent}运行数据正常`));
});

document.querySelectorAll('.kpi').forEach((card) => {
  card.tabIndex = 0;
  const activate = () => {
    document.querySelectorAll('.kpi').forEach((item) => item.classList.remove('selected'));
    card.classList.add('selected');
    const label = card.querySelector('small').textContent;
    const value = `${card.querySelector('strong').textContent}${card.querySelector('em').textContent}`;
    showToast(`${label}：${value} · ${card.querySelector('p').textContent}`);
  };
  card.addEventListener('click', activate);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') activate();
  });
});

document.querySelectorAll('.quality-rings > div').forEach((item) => {
  item.addEventListener('click', () => {
    const label = item.querySelector('span').textContent;
    const value = item.querySelector('strong').textContent;
    showToast(`${label} ${value} · 点击查看趋势分析`);
  });
});

document.querySelectorAll('.progress-list label').forEach((item) => {
  item.addEventListener('click', () => {
    showToast(`${item.querySelector('span').textContent}：当前完成 ${item.querySelector('b').textContent}`);
  });
});

updateClock();
setInterval(updateClock, 1000);
renderBars();
animateNumbers();
openCityFromHash();

setInterval(() => {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  document.querySelector('#refreshTime').textContent = time;
}, 10000);
