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
