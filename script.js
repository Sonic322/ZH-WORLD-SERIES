  const ids = ["days", "hours", "minutes", "seconds"];

  function createDigitColumn(digit) {
    const column = document.createElement("div");
    column.className = "digit-column";

    const strip = document.createElement("div");
    strip.className = "digit-strip";

    for (let i = 0; i <= 9; i++) {
      const span = document.createElement("span");
      span.textContent = i;
      strip.appendChild(span);
    }

    column.appendChild(strip);
    column.strip = strip;
    column.setDigit = (val) => {
      const y = parseInt(val) * -1.2; // height in em
      strip.style.transform = `translateY(${y}em)`;
    };

    column.setDigit(digit);
    return column;
  }

  function setOdometerValue(container, valueStr) {
    // Удаляем старые колонки, если длина изменилась
    if (container.children.length !== valueStr.length) {
      container.innerHTML = "";
      for (const ch of valueStr) {
        const digit = createDigitColumn(ch);
        container.appendChild(digit);
      }
    } else {
      for (let i = 0; i < valueStr.length; i++) {
        const ch = valueStr[i];
        const column = container.children[i];
        column.setDigit(ch);
      }
    }
  }

  function updateCountdown() {
    const eventDate = new Date("2025-08-01T00:00:00Z").getTime();
    const now = new Date().getTime();
    const diff = eventDate - now;

    const second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;

    const values = {
      days: Math.floor(diff / day).toString().padStart(2, "0"),
      hours: Math.floor((diff % day) / hour).toString().padStart(2, "0"),
      minutes: Math.floor((diff % hour) / minute).toString().padStart(2, "0"),
      seconds: Math.floor((diff % minute) / second).toString().padStart(2, "0"),
    };

    ids.forEach(id => {
      const container = document.getElementById(id);
      setOdometerValue(container, values[id]);
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });

  // NAV MOBILE
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

// Luicide icons
  document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  } else {
    console.error('Lucide не загружен');
  }
});

 // Footer Donate
  function toggleDonate() {
    const modal = document.getElementById('donateModal');
    modal.classList.toggle('hidden');
  }

  
  function copyAddress() {
  const address = document.getElementById("walletAddress").textContent.trim();
  const btn = document.getElementById("copyBtn");

  navigator.clipboard.writeText(address).then(() => {
    // Меняем содержимое кнопки на "Copied!" с SVG
    btn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 16 16" style="margin-right: 6px;">
<path fill="#bae0bd" d="M7.5 0.5A7 7 0 1 0 7.5 14.5A7 7 0 1 0 7.5 0.5Z"></path><path fill="#5e9c76" d="M7.5,1C11.1,1,14,3.9,14,7.5S11.1,14,7.5,14S1,11.1,1,7.5S3.9,1,7.5,1 M7.5,0C3.4,0,0,3.4,0,7.5 S3.4,15,7.5,15S15,11.6,15,7.5S11.6,0,7.5,0L7.5,0z"></path><path fill="#5e9c76" d="M6.3 10.5L3.7 7.9 4.4 7.2 6.3 9.1 11.2 4.3 11.9 5z"></path>
</svg>
  Copied!
`;


    // Через 2 секунды возвращаем оригинальный вид
    setTimeout(() => {
      btn.innerHTML = `
        Copy Address
      `;
    }, 2000);
  });
}

// Stream Search
function filterStreamers(query) {
  const items = document.querySelectorAll('#streamers .streamer');
  const lowerQuery = query.toLowerCase();
  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(lowerQuery) ? '' : 'none';
  });
}


const API_KEY = 'AIzaSyAqLrnXgZ31rWgpgEESLXbtigo_D1T2lq0';

const streamers = [
  { name: 'DoMiNaToR', channelId: 'UCkoFrzmLq_bKtYi1aKHbhpQ', statusElementId: 'status-dominator', subsElementId: 'subs-dominator' },
  { name: 'Legionnaire Generals', channelId: 'UCc_5y63oJbvvztMHqa_E2uA', statusElementId: 'status-legi', subsElementId: 'subs-legi' },
  { name: 'Marakar', channelId: 'UCT156NmNhMPW0EXbkKvv7Mg', statusElementId: 'status-marakar', subsElementId: 'subs-marakar' },
  { name: 'StaZzz', channelId: 'UCaqNK0xKxJZfAEep9mXPYiA', statusElementId: 'status-stazzz', subsElementId: 'subs-stazzz' },
  { name: 'TumStep', channelId: 'UCEWH199TvGw8KGjYZkRJg8Q', statusElementId: 'status-tumstep', subsElementId: 'subs-tumstep' },
  { name: 'ExCaL', channelId: 'UCXGWk49Q-BNeoWq1z0qaCnw', statusElementId: 'status-excal', subsElementId: 'subs-excal' },
  { name: 'bl9rTV', channelId: 'UCDV2KudJNN9TXMax7yXZ1GA', statusElementId: 'status-bl9r', subsElementId: 'subs-bl9r' }
];

// Кэши
const streamerStatusCache = {};   // { [channelId]: { isLive, lastCheck } }
const subscribersCache = {};      // { [channelId]: { count, lastCheck } }

// Проверка онлайн статуса с кешем 5 минут
async function checkIfLive(channelId) {
  const now = Date.now();
  const cache = streamerStatusCache[channelId];

  if (cache && now - cache.lastCheck < 60 * 60 * 1000) { // 60 минут кеш
    return cache.isLive;
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const isLive = data.items && data.items.length > 0;

    streamerStatusCache[channelId] = { isLive, lastCheck: now };

    return isLive;
  } catch (err) {
    console.error('Ошибка API (статус):', err);
    return false;
  }
}

// Получение подписчиков с кешем 1 час
async function fetchSubscribersCount(channelId) {
  const now = Date.now();
  const cache = subscribersCache[channelId];

  if (cache && now - cache.lastCheck < 2880 * 60 * 1000) { // 48 часов кеш
    return cache.count;
  }

  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const count = Number(data.items[0].statistics.subscriberCount);
      subscribersCache[channelId] = { count, lastCheck: now };
      return count;
    }
    return null;
  } catch (err) {
    console.error('Ошибка API (подписчики):', err);
    return null;
  }
}

// Обновление статуса (online/offline)
async function updateStreamerStatuses() {
  for (const streamer of streamers) {
    const isLive = await checkIfLive(streamer.channelId);

    const statusEl = document.getElementById(streamer.statusElementId);
    if (statusEl) {
      statusEl.innerHTML = isLive
        ? `<span class="inline-flex items-center gap-2 text-green-400">
             <span class="relative flex h-2 w-2">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             В эфире
           </span>`
        : `<span class="inline-flex items-center gap-2 text-gray-400">
             <span class="relative flex h-2 w-2">
               <span class="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
             </span>
             Offline
           </span>`;
    }
  }
}

// Обновление количества подписчиков
async function updateSubscribersCounts() {
  for (const streamer of streamers) {
    const count = await fetchSubscribersCount(streamer.channelId);
    const subsEl = document.getElementById(streamer.subsElementId);
    if (subsEl) {
      subsEl.textContent = count !== null
        ? `${count.toLocaleString()} followers`
        : 'Subs: no data';
    }
  }
}

// Запуск и интервалы
document.addEventListener("DOMContentLoaded", () => {
  updateStreamerStatuses();
  updateSubscribersCounts();

  setInterval(updateStreamerStatuses, 60 * 60 * 1000);      // каждые 60 минут
  setInterval(updateSubscribersCounts, 2880 * 60 * 1000);   // каждые 48 часов
});

const scrollBtn = document.getElementById("scrollToTopBtn");

  // Показывать кнопку при прокрутке вниз
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.remove("hidden");
    } else {
      scrollBtn.classList.add("hidden");
    }
  });

  // Скролл наверх при нажатии
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });