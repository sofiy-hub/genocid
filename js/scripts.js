function toggleSidebarDrawer() {
  const drawer = document.getElementById('sidebar-drawer');
  const overlay = document.getElementById('drawer-overlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
}
 
function closeSidebarDrawer() {
  document.getElementById('sidebar-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
}
 
function switchTab(tabId, btnElement) {
  document.querySelectorAll('.book-page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.drawer-nav-btn').forEach(btn => btn.classList.remove('active'));
 
  const targetPage = document.getElementById(tabId);
  if (targetPage) {
    targetPage.classList.add('active');
   
    if (btnElement) {
      btnElement.classList.add('active');
    } else {
      const btn = document.querySelector(`.drawer-nav-btn[onclick*="${tabId}"]`);
      if (btn) btn.classList.add('active');
    }
 
    const pageTitle = targetPage.querySelector('h2').textContent;
    document.getElementById('header-current-title').textContent = pageTitle;
 
    buildDynamicTOC(tabId);
 
    closeSidebarDrawer();
 
    window.location.hash = tabId;
    window.scrollTo({ top: 340, behavior: 'smooth' });
  }
}
 
function toggleTOC() {
    const tocWrapper = document.getElementById('collapsible-toc');
    tocWrapper.classList.toggle('open');
    const isOpen = tocWrapper.classList.contains('open');
    document.getElementById('header-toc-indicator').textContent = isOpen ? '' : '';
}
 
function buildDynamicTOC(tabId) {
  const page = document.getElementById(tabId);
  const tocList = document.getElementById('dynamic-toc');
  if (!page || !tocList) return;
 
  tocList.innerHTML = '';
  const headers = page.querySelectorAll('h2, h3');
 
  headers.forEach(h => {
    if (!h.id) {
      h.id = 'sec-' + Math.random().toString(36).substr(2, 9);
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.replace('â– ', '').trim();
    a.onclick = function(e) {
      e.preventDefault();
      document.getElementById(h.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    li.appendChild(a);
    tocList.appendChild(li);
  });
}

let currentFontScale = 1;
function adjustFontSize(delta) {
  if (delta === 0) {
    currentFontScale = 1;
  } else {
    currentFontScale = Math.max(0.8, Math.min(1.4, currentFontScale + delta));
  }
  document.documentElement.style.setProperty('--font-scale', currentFontScale);
  showToast(`: ${Math.round(currentFontScale * 100)}%`);
}
 
function toggleTheme() {
  document.body.classList.toggle('theme-night');
  const isNight = document.body.classList.contains('theme-night');
  showToast(isNight ? '' : '');
}
 
function openSearchModal() {
  document.getElementById('search-modal').classList.add('active');
  document.getElementById('search-input').focus();
}
 
function closeSearchModal(e) {
  document.getElementById('search-modal').classList.remove('active');
}
 
window.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearchModal();
  }
  if (e.key === 'Escape') {
    closeSearchModal();
    closeSidebarDrawer();
  }
});
 
function performSearch() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const resultsContainer = document.getElementById('search-results');
 
  if (query.length < 2) {
    resultsContainer.innerHTML = '<div style="font-size: 13px; color: #888;"></div>';
    return;
  }
 
  resultsContainer.innerHTML = '';
  const pages = document.querySelectorAll('.book-page');
  let foundCount = 0;
 
  pages.forEach(page => {
    const tabId = page.id;
    const pageTitle = page.querySelector('h2').textContent;
    const paragraphs = page.querySelectorAll('p, .quote-box, .section-title, .author-item, .criminal-item');
 
    paragraphs.forEach(p => {
      const text = p.textContent;
      if (text.toLowerCase().includes(query)) {
        foundCount++;
        const item = document.createElement('div');
        item.className = 'search-result-item';
       
        const idx = text.toLowerCase().indexOf(query);
        const start = Math.max(0, idx - 40);
        const end = Math.min(text.length, idx + query.length + 60);
        let snippet = text.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
 
        item.innerHTML = `
          <div class="search-result-title">${pageTitle}</div>
          <div class="search-result-snippet">${snippet}</div>
        `;
 
        item.onclick = function() {
          closeSearchModal();
          switchTab(tabId);
          p.scrollIntoView({ behavior: 'smooth', block: 'center' });
          p.style.outline = '2px solid var(--crimson-red)';
          setTimeout(() => { p.style.outline = 'none'; }, 2500);
        };
 
        resultsContainer.appendChild(item);
      }
    });
  });
 
  if (foundCount === 0) {
    resultsContainer.innerHTML = '<div style="font-size: 13px; color: #888;">Found</div>';
  } 
}
window.addEventListener('scroll', () => {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / totalHeight) * 100;
  document.getElementById('reading-progress').style.width = progress + '%';
});
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    if (hash.startsWith('tab-')) {
      switchTab(hash);
    } else {
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        const parentTab = targetEl.closest('.book-page');
        if (parentTab) {
          switchTab(parentTab.id);
          setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth' }), 300);
        }
      }
    }
  } else {
    buildDynamicTOC('tab-intro');
  }
});