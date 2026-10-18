/* ============================================================
   大模型推理分享 · 单页滚动运行时
   - 顶部阅读进度
   - 目录抽屉（按钮 / ESC / 遮罩 / 点链接）
   - 当前章节高亮（顶部导航 + 目录）
   - 滚动入场动画（html-ppt 的 anim-* 类）
   - 图片点击放大
   - 回到顶部
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 阅读进度 ---------- */
  var bar = doc.getElementById('progressBar');

  /* ---------- 2. 回到顶部 ---------- */
  var toTop = doc.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 3. 目录抽屉 ---------- */
  var drawer = doc.getElementById('drawer');
  var scrim = doc.getElementById('scrim');
  var tocBtn = doc.getElementById('tocBtn');
  var drawerClose = doc.getElementById('drawerClose');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    if (scrim) scrim.classList.add('open');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    if (scrim) scrim.classList.remove('open');
  }
  if (tocBtn) tocBtn.addEventListener('click', function () {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);
  if (drawer) drawer.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeDrawer();
  });

  /* ---------- 4. 图片放大 ---------- */
  var lb = doc.getElementById('lightbox');
  var lbImg = doc.getElementById('lbImg');
  var lbCap = doc.getElementById('lbCap');
  var lbClose = doc.getElementById('lbClose');

  function openLightbox(src, caption) {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    if (lbCap) lbCap.textContent = caption || 'DIAGRAM';
    lb.classList.add('open');
    lb.scrollTop = 0;
    doc.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('open');
    if (lbImg) lbImg.src = '';
    doc.body.style.overflow = '';
  }
  if (lb) lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target === lbClose) closeLightbox();
  });

  // 所有配图都可点击放大；带 data-zoom 的竖长图用原图放大
  Array.prototype.forEach.call(doc.querySelectorAll('.figure'), function (fig) {
    var frame = fig.querySelector('.frame');
    var img = fig.querySelector('img');
    if (!frame || !img) return;
    var capEl = fig.querySelector('figcaption');
    var caption = capEl ? capEl.textContent.trim() : '';
    var src = frame.getAttribute('data-zoom') || img.getAttribute('src');
    frame.addEventListener('click', function () { openLightbox(src, caption); });
    frame.style.cursor = 'zoom-in';
  });

  /* ---------- 5. ESC ---------- */
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (lb && lb.classList.contains('open')) { closeLightbox(); return; }
    closeDrawer();
  });

  /* ---------- 6. 滚动入场动画 ---------- */
  var animEls = Array.prototype.slice.call(doc.querySelectorAll('[data-anim]'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(animEls, function (el) { el.style.opacity = 1; });
  } else {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var name = el.getAttribute('data-anim') || 'fade-up';
        el.style.opacity = '';
        el.classList.add('anim-' + name);
        animObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    animEls.forEach(function (el) { animObserver.observe(el); });
  }

  /* ---------- 7. 当前章节高亮 ---------- */
  // 参与高亮的锚点：章节 + 小节（顺序即文档顺序）
  var anchors = Array.prototype.slice.call(
    doc.querySelectorAll('section.chapter[id], article.sec[id]')
  );
  var chapLinks = Array.prototype.slice.call(
    doc.querySelectorAll('#chapNav a')
  );
  var drawerLinks = Array.prototype.slice.call(
    doc.querySelectorAll('#drawerBody a[href^="#"]')
  );
  var sectionToChapter = {};
  Array.prototype.forEach.call(doc.querySelectorAll('section.chapter'), function (ch) {
    var id = ch.id;
    Array.prototype.forEach.call(ch.querySelectorAll('article.sec[id]'), function (sec) {
      sectionToChapter[sec.id] = id;
    });
  });

  function linkFor(id, links) {
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === '#' + id) return links[i];
    }
    return null;
  }

  var currentId = '';
  function updateActive() {
    var probe = 96; // 顶部栏高度附近
    var active = anchors.length ? anchors[0].id : '';
    for (var i = 0; i < anchors.length; i++) {
      if (anchors[i].getBoundingClientRect().top <= probe) active = anchors[i].id;
      else break;
    }
    if (active === currentId) return;
    currentId = active;

    var chapterId = sectionToChapter[active] || active;
    chapLinks.forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('href') === '#' + chapterId);
    });
    drawerLinks.forEach(function (a) { a.classList.remove('on'); });
    var dl = linkFor(active, drawerLinks);
    if (dl) {
      dl.classList.add('on');
      var db = doc.getElementById('drawerBody');
      if (db && drawer && drawer.classList.contains('open')) {
        var r = dl.getBoundingClientRect(), br = db.getBoundingClientRect();
        if (r.top < br.top || r.bottom > br.bottom) {
          db.scrollTop += r.top - br.top - br.height / 2;
        }
      }
    }
  }

  /* ---------- 8. 滚动主循环 ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var h = doc.documentElement;
      var max = h.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.pageYOffset / max) * 100 : 0;
      if (bar) bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
      if (toTop) toTop.classList.toggle('show', window.pageYOffset > 700);
      updateActive();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 9. 直接带 hash 打开时对齐（瞬时，不走平滑动画） ---------- */
  if (window.location.hash) {
    var target = doc.getElementById(window.location.hash.slice(1));
    if (target) {
      window.requestAnimationFrame(function () {
        var top = target.getBoundingClientRect().top + window.pageYOffset - 76;
        window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
      });
    }
  }
})();
