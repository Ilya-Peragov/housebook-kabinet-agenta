/* Общий слой состояния прототипа. Данные отдельно на каждый режим: hb-proto:<mode>:<key>.
   Все обращения к localStorage в try/catch; без хранилища работает память страницы. */
(function (w) {
  'use strict';
  var HB = (w.HB = w.HB || {});
  var MODE_KEY = 'hb-proto-mode';
  var mem = {};
  var subs = [];

  /* Схема этапа 2 (на этапе 1 только заложена, значения по умолчанию).
     Шаги «Начала работы» вычисляются из фактов, галочек в списке нет. */
  var SCHEMA = {
    'onb.hidden': false,              /* блок «Начало работы» свёрнут (строка «Показать снова») */
    'onb.done': false,                /* «начало работы завершено», после этого блок не показывается никогда */
    'onb.skipped': { telegram: false, tour: false, invite: false }, /* отметки «Не нужно» у необязательных шагов */
    'facts.profile': {},              /* поля профиля */
    'facts.contractSigned': false,
    'facts.telegram': false,
    'facts.tourSeen': false,
    'facts.invited': [],              /* приглашённые коллеги */
    'facts.clients': [],              /* переданные клиенты */
    'nav.bellRead': false,            /* уведомления в колокольчике прочитаны */
    'msg.unread': null,               /* число непрочитанных сообщений для бейджа меню */
    'msg.read': {},                   /* прочитанные диалоги */
    'cl.done': {},                    /* ответы «Ответ получен» по клиентам: {id клиента: {chip, text, ts}} */
    'invite.log': []                  /* журнал приглашений для событий Главной */
  };
  /* у опытного агента всё уже сделано: договор подписан, Telegram подключён, тур просмотрен, обучение завершено */
  var PRO_DEFAULTS = { 'onb.done': true, 'facts.contractSigned': true, 'facts.telegram': true, 'facts.tourSeen': true };

  function readMode() {
    try { var m = w.localStorage.getItem(MODE_KEY); if (m === 'novice' || m === 'pro') return m; } catch (e) {}
    return mem[MODE_KEY] === 'novice' ? 'novice' : 'pro';
  }
  function fk(key, mode) { return 'hb-proto:' + (mode || readMode()) + ':' + key; }
  function emit(key, val) { subs.slice().forEach(function (fn) { try { fn(key, val); } catch (e) {} }); }

  var store = {
    get: function (key, def) {
      var k = fk(key), raw = null;
      try { raw = w.localStorage.getItem(k); } catch (e) {}
      if (raw !== null) { try { return JSON.parse(raw); } catch (e2) {} }
      if (k in mem) return mem[k];
      if (def !== undefined) return def;
      if (readMode() === 'pro' && Object.prototype.hasOwnProperty.call(PRO_DEFAULTS, key)) return PRO_DEFAULTS[key];
      return Object.prototype.hasOwnProperty.call(SCHEMA, key) ? JSON.parse(JSON.stringify(SCHEMA[key])) : undefined;
    },
    set: function (key, val) {
      var k = fk(key);
      mem[k] = val;
      try { w.localStorage.setItem(k, JSON.stringify(val)); } catch (e) {}
      emit(key, val);
      return val;
    },
    remove: function (key) {
      var k = fk(key); delete mem[k];
      try { w.localStorage.removeItem(k); } catch (e) {}
      emit(key, undefined);
    },
    subscribe: function (fn) {
      subs.push(fn);
      return function () { subs = subs.filter(function (f) { return f !== fn; }); };
    },
    /* стереть всё состояние режима */
    reset: function (mode) {
      var pre = fk('', mode);
      Object.keys(mem).forEach(function (k) { if (k.indexOf(pre) === 0) delete mem[k]; });
      try {
        var del = [];
        for (var i = 0; i < w.localStorage.length; i++) { var k = w.localStorage.key(i); if (k && k.indexOf(pre) === 0) del.push(k); }
        del.forEach(function (k2) { w.localStorage.removeItem(k2); });
      } catch (e) {}
      emit('*', undefined);
    }
  };

  HB.SCHEMA = SCHEMA;
  HB.store = store;
  HB.mode = {
    get: readMode,
    set: function (m) {
      m = m === 'novice' ? 'novice' : 'pro';
      mem[MODE_KEY] = m;
      try { w.localStorage.setItem(MODE_KEY, m); } catch (e) {}
      emit('mode', m);
    }
  };
  /* ---------- производные данные (из фактов, а не из кликов) ---------- */
  var isNovice = function () { return readMode() === 'novice'; };
  HB.isNovice = isNovice;
  var digits = function (v) { return String(v == null ? '' : v).replace(/\D/g, ''); };

  /* имя агента: шапка, меню, приветствие. Оба режима: Илья Перагов (решение владельца), введённое в Профиле имя показывается вместо него */
  HB.who = function () {
    var p = store.get('facts.profile') || {};
    var first = (p.first != null ? String(p.first) : 'Илья').trim() || 'Илья';
    var last = (p.last != null ? String(p.last) : 'Перагов').trim();
    return { first: first, last: last, full: (first + ' ' + last).trim(), initials: (first.charAt(0) + last.charAt(0)).toUpperCase() };
  };

  /* профиль заполнен: имя, фамилия, почта, телефон, страна сохранены */
  function profileDone() {
    if (!isNovice()) return true;
    var p = store.get('facts.profile');
    if (!p) return false;
    return !!(String(p.first || '').trim() && String(p.last || '').trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(p.mail || '').trim()) && digits(p.wa).length >= 7 && p.country && p.country !== 'Не выбрана');
  }
  var ownClients = function () { return (store.get('facts.clients') || []).filter(function (c) { return c && c.own && !c.cold; }); };
  /* шаги «Начала работы»: 7, отметки вычисляются из фактов; необязательные можно отметить «Не нужно» */
  var STEPS = [
    { id: 'account', req: true, t: 'Аккаунт создан' },
    { id: 'profile', req: true, t: 'Заполните профиль', href: 'profil.html', btn: 'Заполнить профиль', d: 'Имя, фамилия, почта, телефон и страна. Это займёт пару минут.', ic: 'user' },
    { id: 'contract', req: true, t: 'Подпишите договор', href: 'dokumenty.html', btn: 'Подписать договор', d: 'Без договора выплаты не начнутся. Нужно прочитать договор и ввести код из письма.', ic: 'file' },
    { id: 'telegram', req: false, skip: 'telegram', t: 'Подключите Telegram', href: 'profil.html', btn: 'Подключить Telegram', d: 'Статусы клиентов будут приходить в мессенджер. Это необязательно.', ic: 'send' },
    { id: 'tour', req: false, skip: 'tour', t: 'Пройдите тур по кабинету', act: 'tour', btn: 'Смотреть тур', d: 'Короткое видео: где лежат клиенты, деньги и материалы. Это необязательно.', ic: 'play' },
    { id: 'invite', req: false, skip: 'invite', t: 'Пригласите коллегу', href: 'komanda.html', btn: 'Пригласить агента', d: 'Коллега, которого Вы пригласили, встанет в Вашу сеть. Это необязательно.', ic: 'users' },
    { id: 'client', req: true, t: 'Передайте первого клиента', href: 'klienty-forma.html', btn: 'Передать клиента', d: 'Имя, телефон, страна и чего хочет клиент. Остальное сделает локальный партнёр.', ic: 'send' }
  ];
  HB.onb = {
    facts: function () {
      var pro = !isNovice();
      return {
        account: true,
        profile: profileDone(),
        contract: pro || !!store.get('facts.contractSigned'),
        telegram: pro || !!store.get('facts.telegram'),
        tour: pro || !!store.get('facts.tourSeen'),
        invite: pro || (store.get('facts.invited') || []).length > 0,
        client: pro || ownClients().length > 0
      };
    },
    /* список шагов с состоянием: done / skip / todo, и номером следующего шага */
    steps: function () {
      var f = HB.onb.facts(), sk = store.get('onb.skipped') || {}, cur = -1, i;
      var list = STEPS.map(function (s, n) {
        var st = f[s.id] ? 'done' : (s.skip && sk[s.skip] ? 'skip' : 'todo');
        return Object.assign({ n: n + 1, state: st }, s);
      });
      for (i = 0; i < list.length && cur < 0; i++) if (list[i].state === 'todo' && list[i].req) cur = i;
      for (i = 0; i < list.length && cur < 0; i++) if (list[i].state === 'todo') cur = i;
      list.forEach(function (s, n) { s.cur = n === cur; });
      return list;
    },
    count: function () { return HB.onb.steps().filter(function (s) { return s.state !== 'todo'; }).length; },
    total: STEPS.length,
    allDone: function () { return HB.onb.steps().every(function (s) { return s.state !== 'todo'; }); }
  };
  HB.clientsAll = function () { return store.get('facts.clients') || []; };
  var hhmm = function (ts) { var d = new Date(ts || Date.now()); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  /* события Главной из действий агента: переданные клиенты и приглашённые коллеги, новые сверху */
  HB.events = function () {
    var out = [];
    HB.clientsAll().forEach(function (c) {
      if (!c || !c.ts) return;
      out.push({ ts: c.ts || 0, t: (c.cold ? 'Вы передали контакт ' : 'Вы передали клиента ') + c.name, s: c.seek || '', href: 'klienty-kartochka.dc.html', cid: c.id });
    });
    (store.get('facts.invited') || []).forEach(function (x) {
      out.push({ ts: x.ts || 0, t: 'Вы пригласили коллегу ' + x.name, s: x.mail, href: 'komanda.dc.html', cid: '' });
    });
    out.sort(function (a, b) { return b.ts - a.ts; });
    out.forEach(function (e) { e.time = hhmm(e.ts); });
    return out;
  };
  /* подборки клиента по имени (для карточки клиента) */
  HB.collectionsOf = function (name) {
    var cols = store.get('podb.cols') || (isNovice() ? [] : [
      { client: 'Дмитрий Орлов', title: 'Квартира у моря, Дубай', st: 'seen', items: [1, 2, 3] },
      { client: 'Сергей Лукин', title: 'Дом с садом, Лимассол', st: 'sent', items: [1, 2, 3, 4] },
      { client: 'Павел Киселёв', title: 'Квартира с видом, Дубай', st: 'fb', items: [1, 2, 3, 4] },
      { client: 'Мария Назарова', title: 'Инвестиции, Пхукет', st: 'draft', items: [1, 2] }]);
    var ST = { draft: 'Черновик', sent: 'Отправлена', seen: 'Просмотрена', fb: 'Есть отзыв' };
    return cols.filter(function (c) { return c.client === name; }).map(function (c) { return { title: c.title, sub: (ST[c.st] || '') + ' · объектов: ' + c.items.length }; });
  };

  /* изменения из соседней вкладки */
  try { w.addEventListener('storage', function (e) { if (e.key && e.key.indexOf('hb-proto:') === 0) emit(e.key, null); }); } catch (e) {}
})(window);
