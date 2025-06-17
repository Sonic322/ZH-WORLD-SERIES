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






