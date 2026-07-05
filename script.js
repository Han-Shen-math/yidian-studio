const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const customStudio = document.querySelector(".custom-studio");
const parallaxImage = document.querySelector("[data-parallax]");
const heroAnimation = document.querySelector("[data-hero-animation]");

const projectData = {
  city: {
    title: "城市伴手礼套装",
    desc: "适合文旅发布、城市会客厅、展会伴手礼。",
    tone: "雅致东方",
    base: 62,
    days: [21, 28],
  },
  museum: {
    title: "馆藏衍生系列",
    desc: "适合博物馆商店、主题展览和会员礼品。",
    tone: "藏品转译",
    base: 78,
    days: [28, 38],
  },
  brand: {
    title: "企业品牌礼赠",
    desc: "适合客户答谢、年会活动和商务来访。",
    tone: "品牌识别",
    base: 68,
    days: [18, 30],
  },
  private: {
    title: "私人纪念礼",
    desc: "适合婚礼、生日、家庭纪念和小批量收藏。",
    tone: "专属叙事",
    base: 48,
    days: [14, 24],
  },
};

const materialData = {
  paper: { label: "宣纸肌理", multiplier: 1 },
  silk: { label: "真丝织物", multiplier: 1.42 },
  ceramic: { label: "陶瓷釉色", multiplier: 1.28 },
  lacquer: { label: "漆器质感", multiplier: 1.56 },
};

const processData = [
  {
    count: "01 / 04",
    title: "先把故事讲准确",
    text: "梳理品牌、文化符号、使用场景、预算和交付节点，确认产品方向与优先级。",
  },
  {
    count: "02 / 04",
    title: "把方向变成视觉方案",
    text: "输出主题概念、产品组合、图案语言、包装结构和初步成本建议。",
  },
  {
    count: "03 / 04",
    title: "让样品经得起触摸",
    text: "推进材质、颜色、手感、结构和包装细节打样，完成可量产版本。",
  },
  {
    count: "04 / 04",
    title: "稳定交付到使用场景",
    text: "对接供应链、品控、包装入库与物流，让成品准时进入销售或赠礼环节。",
  },
];

const state = {
  project: "city",
  material: "paper",
  quantity: 500,
};

function updateHeader() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 28);
  }

  if (progress) {
    progress.style.width = `${Math.min(ratio * 100, 100)}%`;
  }

  if (parallaxImage) {
    parallaxImage.style.setProperty("--hero-shift", `${Math.min(window.scrollY * 0.08, 32)}px`);
  }
}

function respectMotionPreference() {
  if (!heroAnimation || !heroAnimation.dataset.poster || !window.matchMedia) return;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const animatedSrc = heroAnimation.getAttribute("src");

  function applyMotionPreference() {
    heroAnimation.setAttribute("src", motionQuery.matches ? heroAnimation.dataset.poster : animatedSrc);
  }

  applyMotionPreference();
  motionQuery.addEventListener?.("change", applyMotionPreference);
}

function animateCounters() {
  counters.forEach((counter) => {
    if (counter.dataset.done === "true") return;
    const target = Number(counter.dataset.counter);
    const duration = 950;
    const start = performance.now();
    counter.dataset.done = "true";

    function tick(now) {
      const ratio = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);
      counter.textContent = Math.round(target * eased);
      if (ratio < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

function setRevealDelays() {
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
  });
}

function observeReveals() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    animateCounters();
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("hero-content")) animateCounters();
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function formatBudget(value) {
  return `¥ ${(value * 0.82).toFixed(1)}w - ${(value * 1.28).toFixed(1)}w`;
}

function setPressed(buttons, activeButton) {
  buttons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateCustomizer() {
  const project = projectData[state.project];
  const material = materialData[state.material];
  const scaled = (project.base * material.multiplier * Math.sqrt(state.quantity / 500)) / 10;
  const timelineBoost = state.quantity > 1200 ? 8 : state.quantity > 700 ? 4 : 0;

  document.querySelector("[data-preview-title]").textContent = project.title;
  document.querySelector("[data-preview-desc]").textContent = project.desc;
  document.querySelector("[data-preview-material]").textContent = material.label;
  document.querySelector("[data-preview-tone]").textContent = project.tone;
  document.querySelector("[data-preview-quantity]").textContent = `${state.quantity} 件`;
  document.querySelector("[data-quantity-output]").textContent = state.quantity;
  document.querySelector("[data-budget]").textContent = formatBudget(scaled);
  document.querySelector("[data-timeline]").textContent =
    `${project.days[0] + timelineBoost}-${project.days[1] + timelineBoost} 天`;

  if (customStudio) {
    customStudio.dataset.activeMaterial = state.material;
  }
}

function wireCustomizer() {
  const projectButtons = document.querySelectorAll("[data-project]");
  const materialButtons = document.querySelectorAll("[data-material]");
  const quantityInput = document.querySelector("[data-quantity]");

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.project = button.dataset.project;
      setPressed(projectButtons, button);
      updateCustomizer();
    });
  });

  materialButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.material = button.dataset.material;
      setPressed(materialButtons, button);
      updateCustomizer();
    });
  });

  if (quantityInput) {
    quantityInput.addEventListener("input", (event) => {
      state.quantity = Number(event.target.value);
      updateCustomizer();
    });
  }
}

function wireWorkFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let firstVisible = null;
      setPressed(filterButtons, button);

      cards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
        if (shouldShow && !firstVisible) firstVisible = card;
      });

      if (firstVisible) updateWorkStage(firstVisible);
    });
  });
}

function updateWorkStage(card) {
  const stage = document.querySelector(".work-stage");
  if (!stage) return;

  const media = stage.querySelector("[data-stage-media]");
  const kicker = stage.querySelector("[data-stage-kicker]");
  const title = stage.querySelector("[data-stage-title]");
  const text = stage.querySelector("[data-stage-text]");

  if (!(media && kicker && title && text)) return;

  media.classList.remove("crop-one", "crop-two", "crop-three");
  media.classList.add(card.dataset.crop || "crop-one");
  kicker.textContent = card.dataset.kicker || "";
  title.textContent = card.dataset.title || "";
  text.textContent = card.dataset.text || "";

  stage.classList.add("is-changing");
  window.setTimeout(() => stage.classList.remove("is-changing"), 260);
}

function wireWorkStage() {
  document.querySelectorAll(".work-card[data-title]").forEach((card) => {
    card.addEventListener("pointerenter", () => updateWorkStage(card));
    card.addEventListener("focus", () => updateWorkStage(card));
    card.addEventListener("click", () => updateWorkStage(card));
  });
}

function wireProcessTabs() {
  const stepButtons = document.querySelectorAll("[data-step]");

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.step);
      const content = processData[step];

      stepButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      document.querySelector("[data-process-count]").textContent = content.count;
      document.querySelector("[data-process-title]").textContent = content.title;
      document.querySelector("[data-process-text]").textContent = content.text;
    });
  });
}

function wireMobileNav() {
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (nav) {
    nav.addEventListener("click", (event) => {
      if (!(event.target instanceof HTMLAnchorElement)) return;
      document.body.classList.remove("nav-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  }
}

function wireLeadForm() {
  const form = document.querySelector("[data-lead-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = document.querySelector("[data-form-note]");
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();

    note.textContent = `${name || "您好"}，需求已记录。艺点会优先从产品方向、预算和交付时间三个维度与您沟通。`;
    note.style.color = "#5f806e";
    form.reset();
  });
}

function wireTiltCards() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-y", `${x * 4}deg`);
      card.style.setProperty("--tilt-x", `${y * -4}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

function wirePointerLight() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  window.addEventListener(
    "pointermove",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const isInteractive = Boolean(target?.closest("a, button, input, textarea, .tilt-card"));
      document.body.classList.add("has-pointer");
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      document.documentElement.style.setProperty("--cursor-scale", isInteractive ? "0.72" : "1");
    },
    { passive: true }
  );
}

function observeActiveSections() {
  if (!("IntersectionObserver" in window) || !nav) return;

  const links = Array.from(nav.querySelectorAll("a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

setRevealDelays();
respectMotionPreference();
observeReveals();
wireCustomizer();
wireWorkFilters();
wireWorkStage();
wireProcessTabs();
wireMobileNav();
wireLeadForm();
wireTiltCards();
wirePointerLight();
observeActiveSections();

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader);

updateHeader();
updateCustomizer();
