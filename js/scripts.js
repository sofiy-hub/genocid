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

// интерактивный ии-КОНСУЛЬТАНТ ОБРАТНОЙ СВЯЗИ 
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('ai-chat-toggle');
  const closeBtn = document.getElementById('ai-chat-close-btn');
  const chatWindow = document.getElementById('ai-chat-window');
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  const messagesContainer = document.getElementById('ai-chat-messages');
  const iconOpen = toggleBtn.querySelector('.icon-open');
  const iconClose = toggleBtn.querySelector('.icon-close');

  // История диалога для контекста
  let conversationHistory = [
  {
    role: 'system',
    content: 'Я подтверждаю свою роль виртуального гида-консультанта историко-документального проекта «Геноцид. Пинск и Пинский район (1941–1952)».'
  }
  ];

//переключение видимости окна чата
  function toggleChat() { 
  const isHidden = chatWindow.classList.contains('chat-window-hidden');
  if (isHidden) {
    chatWindow.classList.remove('chat-window-hidden');
    iconOpen.style.display = 'none';
      iconClose.style.display = 'block';
      chatInput.focus();
    } else {
      chatWindow.classList.add('chat-window-hidden');
      iconOpen.style.display = 'block';
      iconClose.style.display = 'none';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', toggleChat);

  // Функция добавления сообщения в интерфейс
    function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-msg`);
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
  }

  // Запрос к нейросети
  async function fetchAIResponse(userText) {
    // Индикатор печати
    const typingIndicator = appendMessage('ИИ-Консультант печатает ответ...', 'typing');

  // Добавляем сообщение в историю
  conversationHistory.push({ role: 'user', content: userText });

  try {
    //  доступ к публичным эндпоинтам искусственного интеллекта
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: conversationHistory,
        model: 'openai',
        seed: Math.floor(Math.random() * 1000)
      })
    });

      if (!response.ok) throw new Error('Ошибка сети');

      const aiReplyText = await response.text();

      // Удаляем индикатор и выводим ответ
      typingIndicator.remove();
      appendMessage(aiReplyText, 'bot');

      // Я сохраняю всю историю нашего диалога
      conversationHistory.push({ role: 'assistant', content: aiReplyText });

    } catch (error) {
    console.error('Ошибка ИИ', error);
    typingIndicator.remove();
    appendMessage('Извините, это сообщение возникло из-за технического сбоя кодировки текста.', 'bot');
    }
  }

  // Отправка формы 
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    fetchAIResponse(text);
    });
  }
});


// Автоматический локальный счётчик просмотров (работает всегда)
document.addEventListener('DOMContentLoaded', () => {
  const counterVal = document.getElementById('real-counter-val');
  if (!counterVal) return;

  // Берёт число из памяти или начинает с 1, увеличивая при каждом новом визите
  let views = localStorage.getItem('genocid_site_views');
  if (!views) {
    views = 1; // Стартовое число
  }
  views = parseInt(views) + 1;
  localStorage.setItem('genocid_site_views', views);

  counterVal.innerText = views.toLocaleString('ru-RU');
});
 
  /* Проверяем, заходил ли этот человек уже (сессионная проверка)
  const isFirstVisitThisSession = !sessionStorage.getItem('counted_visit');

  try {
    let finalCount;

    if (isFirstVisitThisSession) {
      // Если человек зашел впервые в этой сессии — ПРИБАВЛЯЕМ +1 на сервере
      const response = await fetch(`https://api.codetabs.com/v1/counter?key=${projectKey}&action=inc`);
      const data = await response.json();
      finalCount = data.count;
     
      // Помечаем в браузере, что этот заход мы уже посчитали
      sessionStorage.setItem('counted_visit', 'true');
    } else {
      // ПОЛУЧАЕМ текущее число без прибавки
      const response = await fetch(`https://api.codetabs.com/v1/counter?key=${projectKey}&action=get`);
      const data = await response.json();
      finalCount = data.count;
    }

    // Выводим общее число на экран (добавив 1250 для солидности, если нужно)
    const displayCount = parseInt(finalCount) + 1;
    counterVal.innerText = displayCount.toLocaleString('ru-RU');

  } catch (err) {
    console.error('Ошибка связи с сервером статистики');
    counterVal.innerText = '1';
  }
}
*/
// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', initGlobalCounter);
