// -*- coding: utf-8 -*-

const numberFormatter = new Intl.NumberFormat('zh-CN');

function updateClock() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).formatToParts(now).reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});
  document.querySelector('#clock').textContent = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function animateNumbers() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const duration = 1200;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : numberFormatter.format(Math.round(value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
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
    showToast(`${marker.dataset.city}：${marker.dataset.value} 个在管项目`);
  });
});

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

updateClock();
setInterval(updateClock, 1000);
renderBars();
animateNumbers();

setInterval(() => {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  document.querySelector('#refreshTime').textContent = time;
}, 10000);
