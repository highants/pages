/**
 * Story Reader Client-side Logic (story-reader.js)
 * Shared interactive behavior for literary story pages:
 * - Theme, typography, and size persistence
 * - Reading progress indicator
 * - Integrated properties / settings dropdown controls
 * - Appendix / Commentary accordion toggle
 */

(function () {
  'use strict';

  // 1. Reading Progress Bar Listener
  function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // 2. Frontmatter Tab Switcher (Property Grid <-> Raw YAML)
  window.switchMetaTab = function (mode) {
    const gridView = document.getElementById('metaGridView');
    const rawView = document.getElementById('metaRawView');
    const btnGrid = document.getElementById('btnTabGrid');
    const btnRaw = document.getElementById('btnTabRaw');

    if (!gridView || !rawView) return;

    if (mode === 'grid') {
      gridView.style.display = 'grid';
      rawView.style.display = 'none';
      if (btnGrid) btnGrid.classList.add('active');
      if (btnRaw) btnRaw.classList.remove('active');
    } else {
      gridView.style.display = 'none';
      rawView.style.display = 'block';
      if (btnGrid) btnGrid.classList.remove('active');
      if (btnRaw) btnRaw.classList.add('active');
    }
  };

  // 3. Theme Switcher & Persistence
  window.setTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('story_theme', theme);
      localStorage.setItem('story_catalog_theme', theme);
    } catch (e) {
      console.warn('localStorage access failed:', e);
    }

    // Update theme toggle buttons
    const themes = ['midnight', 'washi', 'obsidian', 'porcelain'];
    themes.forEach(t => {
      const btn = document.getElementById(`btn-theme-${t}`);
      if (btn) {
        btn.classList.toggle('active', t === theme);
      }
    });

    // Update back-to-stories link with ?theme= parameter
    const backLink = document.getElementById('btn-back-stories');
    if (backLink) {
      backLink.setAttribute('href', `stories.html?theme=${encodeURIComponent(theme)}`);
    }
  };

  // Initialize Theme on Page Load (URL parameter first, then localStorage, default: porcelain)
  function initTheme() {
    const urlTheme = new URLSearchParams(window.location.search).get('theme');
    const savedTheme = urlTheme || localStorage.getItem('story_theme') || localStorage.getItem('story_catalog_theme') || 'porcelain';
    window.setTheme(savedTheme);
  }

  // 4. Font Family Switcher
  window.setFontFamily = function (font) {
    document.documentElement.setAttribute('data-font', font);
    const btnSerif = document.getElementById('btn-font-serif');
    const btnSans = document.getElementById('btn-font-sans');
    if (btnSerif) btnSerif.classList.toggle('active', font === 'serif');
    if (btnSans) btnSans.classList.toggle('active', font === 'sans');
  };

  // 5. Font Size Switcher
  window.setFontSize = function (size) {
    document.documentElement.setAttribute('data-size', size);
    ['small', 'medium', 'large'].forEach(s => {
      const btn = document.getElementById(`btn-size-${s}`);
      if (btn) btn.classList.toggle('active', s === size);
    });
  };

  // 6. Integrated PROPERTIES // SETTINGS Dropdown Toggle
  window.toggleFrontmatter = function () {
    const panel = document.getElementById('documentFrontmatter');
    if (!panel) return;

    const isOpen = panel.classList.toggle('open');
    const textSpan = document.getElementById('frontmatterToggleText');
    if (textSpan) {
      textSpan.textContent = isOpen ? '閉じる' : '表示';
    }
    const headerBtn = document.getElementById('btnToggleFrontmatter');
    if (headerBtn) {
      headerBtn.setAttribute('aria-expanded', isOpen);
    }
  };

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const header = document.getElementById('appHeader');
    const panel = document.getElementById('documentFrontmatter');
    if (panel && panel.classList.contains('open') && header && !header.contains(e.target)) {
      window.toggleFrontmatter();
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('documentFrontmatter');
      if (panel && panel.classList.contains('open')) {
        window.toggleFrontmatter();
      }
    }
  });

  // 7. Accordion Toggle for Commentary / Appendix
  window.toggleAppendix = function () {
    const card = document.getElementById('appendixCard');
    if (!card) return;
    const btn = card.querySelector('.accordion-header');
    const isOpen = card.classList.toggle('open');
    if (btn) {
      btn.setAttribute('aria-expanded', isOpen);
    }
  };

  // 8. Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReadingProgress();
      initTheme();
    });
  } else {
    initReadingProgress();
    initTheme();
  }
})();
