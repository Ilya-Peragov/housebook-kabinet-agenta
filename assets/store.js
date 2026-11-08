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
    'invite.log': [],                 /* журнал приглашений для событий Главной */
    'msg.thr': {},                    /* переписки; у сети ключи вида net-<id>, к списку по умолчанию добавляются */
    'msg.cur': null,                  /* диалог, который нужно открыть при заходе в Сообщения */
    'ui.mapView': ''                  /* вид карты сети: rings или list; пусто = по умолчанию (компьютер кольца, телефон список) */
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
    { id: 'profile', req: true, t: 'Заполните профиль', href: 'profil.html', btn: 'Заполнить профиль', d: 'Это займёт пару минут.', chips: ['Имя', 'Фамилия', 'Почта', 'Телефон', 'Страна'], ic: 'user' },
    { id: 'contract', req: true, t: 'Подпишите договор', href: 'dokumenty.html', btn: 'Подписать договор', d: 'Без договора выплаты не начнутся. Нужно прочитать договор и ввести код из письма.', chips: ['2 минуты', 'Подпись онлайн', 'Без печатей'], ic: 'file' },
    { id: 'telegram', req: false, skip: 'telegram', t: 'Подключите Telegram-бота', href: 'profil.html', btn: 'Подключить Telegram', d: 'Статусы клиентов будут приходить в мессенджер. Это необязательно.', chips: ['QR-код', '1 нажатие'], ic: 'send' },
    { id: 'tour', req: false, skip: 'tour', t: 'Пройдите тур по кабинету', act: 'tour', btn: 'Смотреть тур', d: 'Короткое видео: где лежат клиенты, деньги и материалы. Это необязательно.', chips: ['5 минут', 'Видео'], ic: 'play' },
    { id: 'invite', req: false, skip: 'invite', t: 'Пригласите коллегу', href: 'moya-set.html', btn: 'Пригласить агента', d: 'Коллега, которого Вы пригласили, встанет в Вашу сеть. Это необязательно.', chips: ['Ссылка или QR', 'Почта коллеги'], ic: 'users' },
    { id: 'client', req: true, t: 'Передайте первого клиента', href: 'klienty-forma.html', btn: 'Передать клиента', d: 'Остальное сделает локальный партнёр.', chips: ['Имя клиента', 'Телефон', 'Страна', 'Бюджет'], ic: 'send' }
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

  /* ---------- Моя сеть: одни данные для раздела и для «Пульса сети» на Главной ---------- */
  /* сеть из 39 человек (уровни 5/11/14/6/3): [id, ФИО, коротко, кто пригласил, уровень, состояние, подпись]; у нового агента сеть пуста до первого приглашения */
  var NET_RAW = [
      ['m', 'Марат Сулейманов', 'Марат С.', '', 1, 'ok', 'Суперактивный'],
      ['a', 'Айгуль Нурлан', 'Айгуль Н.', 'm', 2, 'ok', 'Работает'],
      ['d', 'Денис Павлов', 'Денис П.', 'a', 3, 'ok', 'Работает'],
      ['o', 'Олег Рыбаков', 'Олег Р.', 'd', 4, 'ok', 'Работает'],
      ['mi', 'Мила Орлова', 'Мила О.', 'o', 5, 'ok', 'Работает'],
      ['gl', 'Глеб Савин', 'Глеб С.', 'o', 5, 'wait', 'Ждёт первого клиента'],
      ['al', 'Алина Фомина', 'Алина Ф.', 'd', 4, 'ok', 'Работает'],
      ['ka', 'Камила Ержанова', 'Камила Е.', 'a', 3, 'ok', 'Работает'],
      ['ta', 'Тамара Исаева', 'Тамара И.', 'ka', 4, 'warn', 'Давно не заходил'],
      ['ya', 'Ярослав Титов', 'Ярослав Т.', 'a', 3, 'wait', 'Ждёт первого клиента'],
      ['ru', 'Руслан Ким', 'Руслан К.', 'm', 2, 'ok', 'Работает'],
      ['ol', 'Ольга Пак', 'Ольга П.', 'ru', 3, 'ok', 'Работает'],
      ['st', 'Станислав Егоров', 'Станислав Е.', 'ol', 4, 'ok', 'Работает'],
      ['vi', 'Виктор Хан', 'Виктор Х.', 'ru', 3, 'warn', 'Давно не заходил'],
      ['ir', 'Ирина Ли', 'Ирина Л.', 'ru', 3, 'ok', 'Работает'],
      ['di', 'Диана Маликова', 'Диана М.', 'm', 2, 'ok', 'Работает'],
      ['el', 'Эльвира Назарова', 'Эльвира Н.', 'di', 3, 'ok', 'Работает'],
      ['ar', 'Артём Беляев', 'Артём Б.', 'm', 2, 'warn', 'Давно не заходил'],
      ['vl', 'Влад Орехов', 'Влад О.', 'ar', 3, 'wait', 'Ждёт первого клиента'],
      ['e', 'Елена Воронцова', 'Елена В.', '', 1, 'ok', 'Активный'],
      ['p', 'Павел Крылов', 'Павел К.', 'e', 2, 'ok', 'Работает'],
      ['na', 'Наталья Зайцева', 'Наталья З.', 'p', 3, 'ok', 'Работает'],
      ['ki', 'Кирилл Волков', 'Кирилл В.', 'na', 4, 'ok', 'Работает'],
      ['po', 'Полина Громова', 'Полина Г.', 'ki', 5, 'warn', 'Давно не заходил'],
      ['ig', 'Игорь Лебедь', 'Игорь Л.', 'p', 3, 'ok', 'Работает'],
      ['in', 'Инна Соколова', 'Инна С.', 'e', 2, 'ok', 'Работает'],
      ['au', 'Артур Мельник', 'Артур М.', 'in', 3, 'wait', 'Ждёт первого клиента'],
      ['bo', 'Борис Шевцов', 'Борис Ш.', 'e', 2, 'warn', 'Давно не заходил'],
      ['r', 'Роман Гусев', 'Роман Г.', '', 1, 'warn', 'Давно не заходил'],
      ['ve', 'Вера Демидова', 'Вера Д.', 'r', 2, 'ok', 'Работает'],
      ['t', 'Тимур Алиев', 'Тимур А.', '', 1, 'warn', 'Давно не заходил'],
      ['sa', 'Сабина Алиева', 'Сабина А.', 't', 2, 'ok', 'Работает'],
      ['dn', 'Динара Алиева', 'Динара А.', 'sa', 3, 'ok', 'Работает'],
      ['em', 'Эмиль Рагимов', 'Эмиль Р.', 'dn', 4, 'wait', 'Ждёт первого клиента'],
      ['fa', 'Фарид Гусейнов', 'Фарид Г.', 'sa', 3, 'ok', 'Работает'],
      ['mu', 'Мурад Касимов', 'Мурад К.', 't', 2, 'ok', 'Работает'],
      ['za', 'Заур Рагимов', 'Заур Р.', 'mu', 3, 'warn', 'Давно не заходил'],
      ['re', 'Ренат Юсупов', 'Ренат Ю.', 't', 2, 'ok', 'Работает'],
      ['s', 'Софья Лебедева', 'Софья Л.', '', 1, 'wait', 'Средний']
  ];
  var NET_BASE = NET_RAW.map(function (r) { return [r[0], r[1], r[3], r[4], r[5]]; });
  /* первый уровень: [почта, телефон, подсказка, вошёл, был, действие] */
  var NET_F = {
      m: ['marat.s@mail.example', '+971 50 111 22 33', '3 клиента, 2 в работе, 1 заявка.', '14 июня 2026', 'вход 5 ноября', ''],
      e: ['e.vorontsova@mail.example', '+7 916 204 18 47', '2 клиента, 1 в работе.', '2 августа 2026', 'вход 3 ноября', ''],
      r: ['r.gusev@mail.example', '+7 916 204 18 50', 'Клиентов пока нет, не заходил больше месяца.', '22 сентября 2026', 'вход 22 сентября', 'nudge'],
      t: ['t.aliev@mail.example', '+7 916 204 18 51', 'Передал одного клиента, не заходил почти месяц. ', '9 октября 2026', 'вход 9 октября', 'nudge'],
      s: ['s.lebedeva@mail.example', '+7 916 204 18 49', 'Зарегистрировалась, первого клиента пока нет. ', '4 ноября 2026', 'вход 4 ноября', 'ask']
  };
  var invitedAll = function () { return store.get('facts.invited') || []; };
  var firstName = function (n) { return String(n || '').split(' ')[0]; };
  HB.net = {
    F: NET_F,
    raw: function () { return isNovice() ? [] : NET_RAW; },
    tree: function (inv) { return (isNovice() ? [] : NET_BASE).concat((inv || []).map(function (x) { return [x.id, x.name, '', 1, 'reg']; })); },
    nameOf: function (id) {
      var r = NET_BASE.filter(function (x) { return x[0] === id; })[0] || invitedAll().map(function (x) { return [x.id, x.name]; }).filter(function (x) { return x[0] === id; })[0];
      return r ? r[1] : id;
    },
    /* пульс сети для Главной: цифры из тех же данных, что и список рефералов */
    pulse: function () {
      var t = HB.net.tree(invitedAll()), net = t.filter(function (x) { return x[4] !== 'reg'; }), reg = t.filter(function (x) { return x[4] === 'reg'; });
      var by = function (st) { return net.filter(function (x) { return x[4] === st; }).sort(function (a, b) { return a[3] - b[3]; }); };
      var warn = by('warn'), wait = by('wait'), act = by('ok').length;
      var names = function (a) { var f = a.filter(function (x) { return x[3] === 1; }), rest = a.length - f.length; return f.map(function (x) { return firstName(x[1]); }).join(', ') + (rest ? (f.length ? ' и ещё ' : 'ещё ') + rest : ''); };
      var allN = function (a) { return a.map(function (x) { return firstName(x[1]); }).join(', '); };
      var note = (warn.length || wait.length ? 'Среди Ваших партнёров первого уровня есть те, кто давно не заходил или ещё не передал клиента. У каждого есть карточка в «Моей сети»: контакты, цифры, история, можно написать или позвонить.' : 'Все на связи. Подробности в «Моей сети».') + (reg.length ? ' Приглашены, ещё не зашли: ' + allN(reg) + '.' : '');
      return {
        t1: act + '\u00a0из\u00a0' + net.length, s1: 'заходили за месяц',
        t2: String(warn.length), s2: warn.length ? names(warn) : 'все на связи',
        t3: String(wait.length), s3: wait.length ? names(wait) : 'все начали', note: note
      };
    },
    /* сообщение рефералу: попадает в Сообщения, в чат с этим человеком */
    send: function (id, text) {
      var thr = Object.assign({}, store.get('msg.thr') || {}), key = 'net-' + id;
      thr[key] = (thr[key] || []).concat([{ me: true, t: text, time: hhmm() }]);
      store.set('msg.thr', thr);
    },
    /* «Написать»: открыть чат с человеком в Сообщениях */
    openChat: function (id) {
      var thr = Object.assign({}, store.get('msg.thr') || {}), key = 'net-' + id;
      if (!thr[key]) { thr[key] = []; store.set('msg.thr', thr); }
      store.set('msg.cur', key);
    }
  };
  /* события Главной из действий агента: переданные клиенты и приглашённые коллеги, новые сверху */
  HB.events = function () {
    var out = [];
    HB.clientsAll().forEach(function (c) {
      if (!c || !c.ts) return;
      out.push({ ts: c.ts || 0, t: (c.cold ? 'Вы передали контакт ' : 'Вы передали клиента ') + c.name, s: c.seek || '', href: 'klienty-kartochka.dc.html', cid: c.id });
    });
    (store.get('facts.invited') || []).forEach(function (x) {
      out.push({ ts: x.ts || 0, t: 'Вы пригласили коллегу ' + x.name, s: x.mail, href: 'moya-set.dc.html', cid: '' });
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
