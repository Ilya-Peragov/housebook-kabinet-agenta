/* Мини-рантайм досок Design Canvas для статического прототипа.
   Страница site/<раздел>.html: <html data-stem="..."> + #root. Доска выбирается по режиму и ширине. */
(function (w, d) {
  'use strict';
  var CFG = {"pages":{"glavnaya":{"novice":{"d":"glavnaya-novichok","m":"glavnaya-novichok-m"},"pro":{"d":"Main","m":"glavnaya-m"}},"api":{"novice":{"d":"api","m":"api-m"},"pro":{"d":"api","m":"api-m"}},"dengi":{"novice":{"d":"dengi-pusto","m":"dengi-pusto-m"},"pro":{"d":"dengi","m":"dengi-m"}},"dengi-pusto":{"novice":{"d":"dengi-pusto","m":"dengi-pusto-m"},"pro":{"d":"dengi-pusto","m":"dengi-pusto-m"}},"dokumenty":{"novice":{"d":"dokumenty","m":"dokumenty-m"},"pro":{"d":"dokumenty","m":"dokumenty-m"}},"klienty-forma":{"novice":{"d":"klienty-forma","m":"klienty-forma-m"},"pro":{"d":"klienty-forma","m":"klienty-forma-m"}},"klienty-kartochka":{"novice":{"d":"klienty-kartochka","m":"klienty-kartochka-m"},"pro":{"d":"klienty-kartochka","m":"klienty-kartochka-m"}},"klienty":{"novice":{"d":"klienty","m":"klienty-m"},"pro":{"d":"klienty","m":"klienty-m"}},"komanda":{"novice":{"d":"komanda","m":"komanda-m"},"pro":{"d":"komanda","m":"komanda-m"}},"materialy":{"novice":{"d":"materialy","m":"materialy-m"},"pro":{"d":"materialy","m":"materialy-m"}},"mediapartner-arhiv":{"novice":{"d":"mediapartner-arhiv","m":"mediapartner-arhiv-m"},"pro":{"d":"mediapartner-arhiv","m":"mediapartner-arhiv-m"}},"mediapartner":{"novice":{"d":"mediapartner-novyy","m":"mediapartner-novyy-m"},"pro":{"d":"mediapartner","m":"mediapartner-m"}},"mediapartner-novyy":{"novice":{"d":"mediapartner-novyy","m":"mediapartner-novyy-m"},"pro":{"d":"mediapartner-novyy","m":"mediapartner-novyy-m"}},"mediapartner-zakryt":{"novice":{"d":"mediapartner-zakryt","m":"mediapartner-zakryt-m"},"pro":{"d":"mediapartner-zakryt","m":"mediapartner-zakryt-m"}},"mediapartner-zapusk":{"novice":{"d":"mediapartner-zapusk","m":"mediapartner-zapusk-m"},"pro":{"d":"mediapartner-zapusk","m":"mediapartner-zapusk-m"}},"moy-sayt":{"novice":{"d":"moy-sayt","m":"moy-sayt-m"},"pro":{"d":"moy-sayt","m":"moy-sayt-m"}},"moya-set-karta":{"novice":{"d":"moya-set-karta","m":"moya-set-karta-m"},"pro":{"d":"moya-set-karta","m":"moya-set-karta-m"}},"moya-set":{"novice":{"d":"moya-set","m":"moya-set-m"},"pro":{"d":"moya-set","m":"moya-set-m"}},"obekty":{"novice":{"d":"obekty","m":"obekty-m"},"pro":{"d":"obekty","m":"obekty-m"}},"obekty-obekt":{"novice":{"d":"obekty-obekt","m":"obekty-obekt-m"},"pro":{"d":"obekty-obekt","m":"obekty-obekt-m"}},"obekty-vybrano":{"novice":{"d":"obekty-vybrano","m":"obekty-vybrano-m"},"pro":{"d":"obekty-vybrano","m":"obekty-vybrano-m"}},"obuchenie":{"novice":{"d":"obuchenie","m":"obuchenie-m"},"pro":{"d":"obuchenie","m":"obuchenie-m"}},"obuchenie-poisk":{"novice":{"d":"obuchenie-poisk","m":"obuchenie-poisk-m"},"pro":{"d":"obuchenie-poisk","m":"obuchenie-poisk-m"}},"obuchenie-urok":{"novice":{"d":"obuchenie-urok","m":"obuchenie-urok-m"},"pro":{"d":"obuchenie-urok","m":"obuchenie-urok-m"}},"podborki-klient":{"novice":{"d":"podborki-klient","m":"podborki-klient-m"},"pro":{"d":"podborki-klient","m":"podborki-klient-m"}},"podborki":{"novice":{"d":"podborki","m":"podborki-m"},"pro":{"d":"podborki","m":"podborki-m"}},"podborki-sozdanie":{"novice":{"d":"podborki-sozdanie","m":"podborki-sozdanie-m"},"pro":{"d":"podborki-sozdanie","m":"podborki-sozdanie-m"}},"pomoshch":{"novice":{"d":"pomoshch","m":"pomoshch-m"},"pro":{"d":"pomoshch","m":"pomoshch-m"}},"profil":{"novice":{"d":"profil","m":"profil-m"},"pro":{"d":"profil","m":"profil-m"}},"soobshcheniya-chat":{"novice":{"d":"soobshcheniya-chat","m":"soobshcheniya-chat-m"},"pro":{"d":"soobshcheniya-chat","m":"soobshcheniya-chat-m"}},"soobshcheniya":{"novice":{"d":"soobshcheniya","m":"soobshcheniya-m"},"pro":{"d":"soobshcheniya","m":"soobshcheniya-m"}},"ssylka":{"novice":{"d":"ssylka","m":"ssylka-m"},"pro":{"d":"ssylka","m":"ssylka-m"}}},"alias":{"dengi-2":"dengi","dengi-2-pusto":"dengi","dengi-3":"dengi","dengi-3-pusto":"dengi","glavnaya-novichok":"glavnaya"},"groups":{"dengi":[["dengi","Есть что запросить"],["dengi-pusto","Нечего запрашивать"]],"dengi-pusto":[["dengi","Есть что запросить"],["dengi-pusto","Нечего запрашивать"]],"mediapartner":[["mediapartner","Медиапартнёр"],["mediapartner-novyy","Заказа ещё нет"],["mediapartner-zapusk","24 часа на отказ"],["mediapartner-arhiv","Договор завершён, чтение"],["mediapartner-zakryt","Нет допуска"]],"mediapartner-novyy":[["mediapartner","Медиапартнёр"],["mediapartner-novyy","Заказа ещё нет"],["mediapartner-zapusk","24 часа на отказ"],["mediapartner-arhiv","Договор завершён, чтение"],["mediapartner-zakryt","Нет допуска"]],"mediapartner-zapusk":[["mediapartner","Медиапартнёр"],["mediapartner-novyy","Заказа ещё нет"],["mediapartner-zapusk","24 часа на отказ"],["mediapartner-arhiv","Договор завершён, чтение"],["mediapartner-zakryt","Нет допуска"]],"mediapartner-arhiv":[["mediapartner","Медиапартнёр"],["mediapartner-novyy","Заказа ещё нет"],["mediapartner-zapusk","24 часа на отказ"],["mediapartner-arhiv","Договор завершён, чтение"],["mediapartner-zakryt","Нет допуска"]],"mediapartner-zakryt":[["mediapartner","Медиапартнёр"],["mediapartner-novyy","Заказа ещё нет"],["mediapartner-zapusk","24 часа на отказ"],["mediapartner-arhiv","Договор завершён, чтение"],["mediapartner-zakryt","Нет допуска"]],"obuchenie":[["obuchenie","Библиотека"],["obuchenie-urok","Окно урока"],["obuchenie-poisk","Ничего не нашлось"]],"obuchenie-urok":[["obuchenie","Библиотека"],["obuchenie-urok","Окно урока"],["obuchenie-poisk","Ничего не нашлось"]],"obuchenie-poisk":[["obuchenie","Библиотека"],["obuchenie-urok","Окно урока"],["obuchenie-poisk","Ничего не нашлось"]],"obekty":[["obekty","Объекты"],["obekty-vybrano","Выбрано 2"],["obekty-obekt","Объект, страница"]],"obekty-vybrano":[["obekty","Объекты"],["obekty-vybrano","Выбрано 2"],["obekty-obekt","Объект, страница"]],"obekty-obekt":[["obekty","Объекты"],["obekty-vybrano","Выбрано 2"],["obekty-obekt","Объект, страница"]],"podborki":[["podborki","Подборки"],["podborki-sozdanie","Новая подборка"],["podborki-klient","Подборка глазами клиента"]],"podborki-sozdanie":[["podborki","Подборки"],["podborki-sozdanie","Новая подборка"],["podborki-klient","Подборка глазами клиента"]],"podborki-klient":[["podborki","Подборки"],["podborki-sozdanie","Новая подборка"],["podborki-klient","Подборка глазами клиента"]],"soobshcheniya":[["soobshcheniya","Сообщения"],["soobshcheniya-chat","Открытый диалог"]],"soobshcheniya-chat":[["soobshcheniya","Сообщения"],["soobshcheniya-chat","Открытый диалог"]],"klienty":[["klienty","Клиенты"],["klienty-kartochka","Карточка клиента"],["klienty-forma","Новый клиент"]],"klienty-kartochka":[["klienty","Клиенты"],["klienty-kartochka","Карточка клиента"],["klienty-forma","Новый клиент"]],"klienty-forma":[["klienty","Клиенты"],["klienty-kartochka","Карточка клиента"],["klienty-forma","Новый клиент"]],"moya-set":[["moya-set","Моя сеть, обзор"],["moya-set-karta","Моя сеть, карта сети"]],"moya-set-karta":[["moya-set","Моя сеть, обзор"],["moya-set-karta","Моя сеть, карта сети"]]},"persist":{"Nav":[{"key":"read","store":"nav.bellRead"}],"klienty":[{"key":"extra","store":"facts.clients"}],"klienty-m":[{"key":"extra","store":"facts.clients"}],"klienty-forma":[{"key":"extra","store":"facts.clients"}],"klienty-forma-m":[{"key":"extra","store":"facts.clients"}],"klienty-kartochka":[{"key":"extra","store":"facts.clients"}],"klienty-kartochka-m":[{"key":"extra","store":"facts.clients"}],"soobshcheniya":[{"key":"read","store":"msg.read"},{"key":"thr","store":"msg.thr","merge":true}],"soobshcheniya-m":[{"key":"read","store":"msg.read"},{"key":"thr","store":"msg.thr","merge":true}],"soobshcheniya-chat":[{"key":"read","store":"msg.read"},{"key":"thr","store":"msg.thr","merge":true}],"soobshcheniya-chat-m":[{"key":"read","store":"msg.read"},{"key":"thr","store":"msg.thr","merge":true}],"podborki":[{"key":"cols","store":"podb.cols"}],"podborki-m":[{"key":"cols","store":"podb.cols"}],"podborki-sozdanie":[{"key":"cols","store":"podb.cols"}],"podborki-sozdanie-m":[{"key":"cols","store":"podb.cols"}],"komanda":[{"key":"staff","store":"team.staff"}],"komanda-m":[{"key":"staff","store":"team.staff"}],"moya-set":[{"key":"invited","store":"facts.invited"}],"moya-set-m":[{"key":"invited","store":"facts.invited"}],"moy-sayt":[{"key":"site","store":"site.data"},{"key":"on","store":"site.on"}],"moy-sayt-m":[{"key":"site","store":"site.data"},{"key":"on","store":"site.on"}],"dokumenty":[{"key":"signed","store":"facts.contractSigned"},{"key":"st","store":"doc.consents"}],"dokumenty-m":[{"key":"signed","store":"facts.contractSigned"},{"key":"st","store":"doc.consents"}],"profil":[{"key":"tgOn","store":"facts.telegram"}],"profil-m":[{"key":"tgOn","store":"facts.telegram"}],"mediapartner":[{"key":"stopped","store":"mp.stopped"},{"key":"paidDone","store":"mp.paidDone"}],"mediapartner-m":[{"key":"stopped","store":"mp.stopped"},{"key":"paidDone","store":"mp.paidDone"}],"obuchenie":[{"key":"watched","store":"lib.watched"}],"obuchenie-m":[{"key":"watched","store":"lib.watched"}]}};
  var HB = w.HB;
  var store = HB.store;
  var NARROW = '(max-width: 767px)';

  /* ---------- утилиты ---------- */
  var HOLE = /\{\{([^}]*)\}\}/g;
  var WHOLE = /^\s*\{\{([^}]*)\}\}\s*$/;
  function get(scope, path) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return +path;
    var q = /^'(.*)'$/.exec(path);
    if (q) return q[1];
    var o = scope, ks = path.split('.');
    for (var i = 0; i < ks.length; i++) { if (o == null) return undefined; o = o[ks[i]]; }
    if (o === undefined && ks.length === 1 && (ks[0] === 'isNovice' || ks[0] === 'isPro')) return ks[0] === 'isNovice' ? HB.isNovice() : !HB.isNovice();
    return o;
  }
  /* имя агента из Профиля подставляется в готовые тексты досок (шапка, меню, приветствие) */
  function personalize(s) {
    var pm = s.indexOf('i.peragov@housebook.ae') >= 0;
    if (s.indexOf('Илья') < 0 && s !== 'ИП' && !pm) return s;
    var w = HB.who();
    if (s === 'ИП') return w.initials;
    if (pm) { var pr = HB.store.get('facts.profile') || {}; s = s.replace(/i\.peragov@housebook\.ae/g, pr.mail || 'i.peragov@housebook.ae'); }
    return s.replace(/Илья Перагов/g, w.full).replace(/Илья/g, w.first);
  }
  function sub(s, scope) {
    return personalize(s.replace(HOLE, function (_, e) { var v = get(scope, e); return v == null || typeof v === 'function' ? '' : String(v); }));
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }

  /* ссылки между досками -> маршруты сайта */
  function route(href) {
    var m = /^(?:\.\/)?([A-Za-z0-9_-]+)\.dc\.html(\?[^#]*)?(#.*)?$/.exec(href);
    if (!m) return href;
    var s = m[1] === 'Main' ? 'glavnaya' : m[1].replace(/-m$/, '');
    s = CFG.alias[s] || s;
    return s + '.html' + (m[2] || '') + (m[3] || '');
  }

  /* ---------- базовый класс логики ---------- */
  var session = null, pending = false;
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (o, cb) {
    var p = typeof o === 'function' ? o(this.state, this.props) : o;
    if (p) Object.assign(this.state, p);
    persistSave(this);
    schedule();
    if (typeof cb === 'function') Promise.resolve().then(cb);
  };
  DCLogic.prototype.forceUpdate = function () { schedule(); };
  w.DCLogic = DCLogic;

  /* состояние досок, которое переживает переход между страницами и общее у досок (через store).
     c = {key, store, invert?, xf?}; xf - имя преобразования из XF (когда у доски свои id, а в store общие) */
  var XF = {};
  function toState(c, v) { var x = c.xf ? XF[c.xf].to(v) : v; return c.invert ? !x : x; }
  function toStore(c, v, inst) {
    var x = c.invert ? !v : v;
    return c.xf ? XF[c.xf].from(x, store.get(c.store)) : x;
  }
  function persistRestore(inst, boardId) {
    var cfg = CFG.persist[boardId];
    inst.__persist = cfg || null;
    inst.__ps = {};
    if (!cfg) return;
    cfg.forEach(function (c) {
      var v = store.get(c.store);
      if (v !== undefined && v !== null) inst.state[c.key] = c.merge ? Object.assign({}, inst.state[c.key], toState(c, v)) : toState(c, v);
      inst.__ps[c.key] = JSON.stringify(inst.state[c.key]);
    });
  }
  function persistSave(inst) {
    var cfg = inst.__persist;
    if (!cfg) return;
    cfg.forEach(function (c) {
      var sv = JSON.stringify(inst.state[c.key]);
      if (sv === inst.__ps[c.key]) return;
      inst.__ps[c.key] = sv;
      var nv = toStore(c, inst.state[c.key], inst);
      if (JSON.stringify(store.get(c.store)) !== JSON.stringify(nv)) store.set(c.store, nv);
    });
  }
  /* общий store: изменение из одного места сразу видно во всех живых досках страницы */
  function persistPull(key) {
    if (!session) return;
    var any = false;
    Object.keys(session.recs).forEach(function (k) {
      var inst = session.recs[k].inst, cfg = inst.__persist;
      if (!cfg) return;
      cfg.forEach(function (c) {
        if (c.store !== key) return;
        var v = store.get(c.store);
        if (v === undefined || v === null) return;
        var nv = c.merge ? Object.assign({}, inst.state[c.key], toState(c, v)) : toState(c, v);
        if (JSON.stringify(nv) === JSON.stringify(inst.state[c.key])) return;
        inst.state[c.key] = nv;
        inst.__ps[c.key] = JSON.stringify(nv);
        any = true;
      });
    });
    if (any) schedule();
  }

  /* ---------- загрузка досок ---------- */
  var boards = {}, classes = {};
  function loadBoard(id) {
    if (!boards[id]) {
      boards[id] = fetch('assets/boards/' + id + '.json').then(function (r) {
        if (!r.ok) throw new Error('board ' + id + ': ' + r.status);
        return r.json();
      }).then(function (b) {
        var t = d.createElement('template');
        /* sc-if и sc-for в шаблоне становятся <template data-sc>: так разбор HTML не выбрасывает их из table, tbody и tr (строки таблицы по списку) */
        t.innerHTML = b.tpl.replace(/<sc-(if|for)\b/g, '<template data-sc="$1"').replace(/<\/sc-(if|for)>/g, '</template>');
        b.nodes = t.content;
        b.id = id;
        return b;
      });
    }
    return boards[id];
  }
  function classOf(b) {
    if (!classes[b.id]) classes[b.id] = new Function('DCLogic', b.script + '\nreturn Component;')(DCLogic);
    return classes[b.id];
  }
  function loadCss(urls) {
    return Promise.all(urls.map(function (u) {
      return new Promise(function (res) {
        var l = d.createElement('link');
        l.rel = 'stylesheet'; l.href = u; l.setAttribute('data-dc', '');
        l.onload = l.onerror = function () { res(l); };
        d.head.appendChild(l);
      });
    }));
  }

  /* ---------- шаблон -> DOM ---------- */
  function mountKids(node, scope, parent, rec) {
    var from = node.localName === 'template' ? node.content : node;
    for (var c = from.firstChild; c; c = c.nextSibling) mount(c, scope, parent, rec);
  }
  function mount(node, scope, parent, rec) {
    if (node.nodeType === 3) { parent.appendChild(d.createTextNode(sub(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'template' && node.getAttribute('data-sc')) tag = 'sc-' + node.getAttribute('data-sc');
    if (tag === 'sc-if') {
      var cv = get(scope, node.getAttribute('value').replace(/[{}]/g, ''));
      if (cv) mountKids(node, scope, parent, rec);
      return;
    }
    if (tag === 'sc-for') {
      var list = get(scope, node.getAttribute('list').replace(/[{}]/g, '')) || [], as = node.getAttribute('as');
      for (var i = 0; i < list.length; i++) {
        var sc = Object.create(scope); sc[as] = list[i]; sc.$index = i;
        mountKids(node, sc, parent, rec);
      }
      return;
    }
    if (tag === 'dc-import') { mountImport(node, scope, parent); return; }
    var el = node.namespaceURI === 'http://www.w3.org/1999/xhtml' ? d.createElement(tag) : d.createElementNS(node.namespaceURI, tag);
    var attrs = {}, props = {}, ev = null;
    for (var a = 0; a < node.attributes.length; a++) {
      var n = node.attributes[a].name, raw = node.attributes[a].value;
      if (n.indexOf('hint-') === 0) continue;
      var m = WHOLE.exec(raw);
      var em = /^on([a-z]+)$/.exec(n);
      if (em) {
        if (m) { var fn = get(scope, m[1]); if (typeof fn === 'function') (ev = ev || {})[em[1]] = fn; }
        continue;
      }
      var v = m ? get(scope, m[1]) : sub(raw, scope);
      if (n === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'select')) {
        props.value = v == null || typeof v === 'function' ? '' : String(v);
        if (tag === 'input') attrs.value = props.value;
        continue;
      }
      if (n === 'checked' && tag === 'input') { props.checked = !!v; continue; }
      if (v == null || typeof v === 'function' || v === false) { if (/^(aria-|data-)/.test(n) && v === false) attrs[n] = 'false'; continue; }
      if (v === true) { attrs[n] = /^(aria-|data-)/.test(n) ? 'true' : ''; continue; }
      v = String(v);
      if (tag === 'a' && n === 'href') v = route(v);
      attrs[n] = v;
    }
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    el.__a = attrs; el.__p = props; el.__ev = ev;
    if (ev) for (var t in ev) listen(el, t);
    mountKids(node, scope, el, rec);
    applyProps(el, {}, props);
    parent.appendChild(el);
  }
  function listen(el, type) {
    var L = el.__l || (el.__l = {});
    if (L[type]) return;
    L[type] = 1;
    el.addEventListener(type, function (e) {
      if (type === 'submit') e.preventDefault();
      var h = el.__ev && el.__ev[type];
      if (h) h(e);
    });
  }
  function applyProps(el, oldP, newP) {
    for (var k in newP) {
      if (oldP[k] === newP[k]) continue;
      if (k === 'value') { if (el.value !== newP.value) el.value = newP.value; }
      else el[k] = newP[k];
    }
  }

  /* ---------- вложенные компоненты ---------- */
  function mountImport(node, scope, parent) {
    var name = node.getAttribute('name'), props = {};
    for (var a = 0; a < node.attributes.length; a++) {
      var n = node.attributes[a].name, raw = node.attributes[a].value;
      if (n === 'name' || n.indexOf('hint-') === 0) continue;
      var m = WHOLE.exec(raw);
      props[camel(n)] = m ? get(scope, m[1]) : sub(raw, scope);
    }
    var key = name + ':' + (props.part || '');
    var rec = session.recs[key];
    var b = session.imports[name];
    if (!b) return;
    if (!rec) rec = session.recs[key] = makeRec(b, props);
    rec.inst.props = props;
    session.seen[key] = 1;
    var vals = rec.inst.renderVals();
    mountKids(b.nodes, vals, parent, rec);
  }
  function makeRec(b, props) {
    var C = classOf(b);
    var inst = new C(props);
    persistRestore(inst, b.id);
    return { inst: inst, board: b, mounted: false };
  }

  /* ---------- сверка нового дерева с живым ---------- */
  function same(o, n) {
    return o.nodeType === n.nodeType && (o.nodeType !== 1 || (o.localName === n.localName && o.namespaceURI === n.namespaceURI));
  }
  function patchEl(o, n) {
    var oa = o.__a || {}, na = n.__a || {}, k;
    for (k in na) if (oa[k] !== na[k]) o.setAttribute(k, na[k]);
    for (k in oa) if (!(k in na)) o.removeAttribute(k);
    o.__a = na;
    o.__ev = n.__ev;
    if (n.__ev) for (k in n.__ev) listen(o, k);
    morph(o, n);
    applyProps(o, o.__p || {}, n.__p || {});
    o.__p = n.__p;
  }
  function morph(o, n) {
    var i = 0, nn;
    while ((nn = n.firstChild)) {
      var on = o.childNodes[i];
      if (!on) { o.appendChild(nn); }
      else if (same(on, nn)) {
        if (nn.nodeType === 1) patchEl(on, nn);
        else if (on.nodeValue !== nn.nodeValue) on.nodeValue = nn.nodeValue;
        n.removeChild(nn);
      } else { o.replaceChild(nn, on); }
      i++;
    }
    while (o.childNodes.length > i) o.removeChild(o.lastChild);
  }

  /* ---------- отрисовка ---------- */
  function schedule() {
    if (pending || !session) return;
    pending = true;
    Promise.resolve().then(function () { pending = false; render(); });
  }
  function render() {
    var s = session;
    if (!s) return;
    var ae = d.activeElement, id = ae && ae.id, st = null;
    try { st = ae && ae.selectionStart != null ? [ae.selectionStart, ae.selectionEnd] : null; } catch (e) {}
    s.seen = {};
    var frag = d.createDocumentFragment();
    var main = s.recs.main;
    main.inst.props = {};
    var vals = main.inst.renderVals();
    mountKids(main.board.nodes, vals, frag, main);
    morph(s.root, frag);
    Object.keys(s.recs).forEach(function (k) {
      if (k !== 'main' && !s.seen[k]) { var r = s.recs[k]; if (r.mounted && r.inst.componentWillUnmount) r.inst.componentWillUnmount(); delete s.recs[k]; }
    });
    if (id && (!ae.isConnected)) {
      var nx = d.getElementById(id);
      if (nx) { nx.focus({ preventScroll: true }); try { if (st) nx.setSelectionRange(st[0], st[1]); } catch (e2) {} }
    }
    Object.keys(s.recs).forEach(function (k) {
      var r = s.recs[k];
      if (!r.mounted) { r.mounted = true; if (r.inst.componentDidMount) r.inst.componentDidMount(); }
      else if (r.inst.componentDidUpdate) r.inst.componentDidUpdate();
    });
    if (!s.shown) { s.shown = true; d.documentElement.classList.remove('hbp-wait'); }
  }
  function teardown() {
    var s = session;
    if (!s) return;
    session = null;
    Object.keys(s.recs).forEach(function (k) { var r = s.recs[k]; if (r.mounted && r.inst.componentWillUnmount) r.inst.componentWillUnmount(); });
    s.root.textContent = '';
    s.nodes.forEach(function (n) { n.remove(); });
  }

  /* ---------- показ доски ---------- */
  var seq = 0;
  function pick() {
    var mode = HB.mode.get(), pg = CFG.pages[d.documentElement.getAttribute('data-stem')];
    return pg[mode][w.matchMedia(NARROW).matches ? 'm' : 'd'];
  }
  function show(id) {
    var my = ++seq;
    return Promise.all([loadBoard(id), loadBoard('Nav')]).then(function (bs) {
      if (my !== seq) return;
      var main = bs[0], nav = bs[1];
      return loadCss(main.css).then(function (links) {
        if (my !== seq) { links.forEach(function (l) { l.remove(); }); return; }
        teardown();
        var nodes = links.slice();
        [nav.helmet, main.helmet].forEach(function (css) {
          if (!css) return;
          var s = d.createElement('style'); s.setAttribute('data-dc', ''); s.textContent = css;
          d.head.appendChild(s); nodes.push(s);
        });
        session = { root: d.getElementById('root'), recs: {}, seen: {}, imports: { Nav: nav }, nodes: nodes, shown: false, id: id };
        session.recs.main = makeRec(main, {});
        render();
      });
    });
  }

  /* ---------- плашка режима, тосты, внешние ссылки ---------- */
  var toastT = 0;
  function toast(msg) {
    var t = d.getElementById('hbp-toast');
    if (!t) { t = d.createElement('div'); t.id = 'hbp-toast'; t.className = 'hbp-toast'; t.setAttribute('role', 'status'); d.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function plaque() {
    var mode = HB.mode.get(), stem = d.documentElement.getAttribute('data-stem');
    var bar = d.createElement('div');
    bar.className = 'hbp'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Режим прототипа');
    var html = '<span class="hbp__m">Режим: <b>' + (mode === 'novice' ? 'новый агент' : 'опытный агент') + '</b></span>' +
      '<button type="button" class="hbp__b" data-act="switch">Переключить</button>' +
      '<button type="button" class="hbp__b" data-act="reset">Начать заново</button>' +
      '<select class="hbp__a" aria-label="Режим прототипа"><option value="">' + (mode === 'novice' ? 'Новый агент' : 'Опытный агент') + '</option>' +
      '<option value="switch">Переключить режим</option><option value="reset">Начать заново</option></select>';
    var sib = CFG.groups[stem];
    if (sib) {
      html += '<label class="hbp__s">Экран <select aria-label="Состояние экрана">' + sib.map(function (x) {
        return '<option value="' + x[0] + '"' + (x[0] === stem ? ' selected' : '') + '>' + x[1] + '</option>';
      }).join('') + '</select></label>';
    }
    bar.innerHTML = html;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.getAttribute('data-act') === 'switch') { HB.mode.set(mode === 'novice' ? 'pro' : 'novice'); w.location.reload(); }
      else if (b.getAttribute('data-act') === 'reset') { store.reset(mode); w.location.reload(); }
    });
    var act = bar.querySelector('.hbp__a');
    act.addEventListener('change', function () {
      if (act.value === 'switch') { HB.mode.set(mode === 'novice' ? 'pro' : 'novice'); w.location.reload(); }
      else if (act.value === 'reset') { store.reset(mode); w.location.reload(); }
    });
    var sel = bar.querySelector('.hbp__s select');
    if (sel) sel.addEventListener('change', function () { w.location.href = sel.value + '.html'; });
    d.body.insertBefore(bar, d.body.firstChild);
    /* пока плашка видна, меню слева сокращается на её высоту (переменная кита) */
    var root = d.documentElement;
    var sync = function () {
      root.style.setProperty('--hbp-h', bar.offsetHeight + 'px');
      root.classList.toggle('hbp-top', w.scrollY < bar.offsetHeight);
    };
    sync();
    w.addEventListener('scroll', sync, { passive: true });
    w.addEventListener('resize', sync);
  }
  /* строка .tbl--open открывает панель по клику в любой ячейке: растяжка кнопки на всю строку держится на tr, а часть браузеров (Safari) не делает tr
     опорным блоком, поэтому на десктопе растяжка только в ячейке имени, остальное добирает этот обработчик; кнопки, ссылки и поля внутри строки не трогаем */
  d.addEventListener('click', function (e) {
    var tr = e.target.closest && e.target.closest('.tbl--open tbody tr');
    if (!tr || e.target.closest('a, button, input, select, label, .cs')) return;
    var b = tr.querySelector('.rowopen');
    if (b) b.click();
  });
  d.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.hasAttribute && t.hasAttribute('data-scrim')) { var x = t.querySelector('[aria-label="Закрыть"]'); if (x) { x.click(); return; } }
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href');
    if (h === '#') { e.preventDefault(); toast('В прототипе этот раздел не открывается'); }
    else if (/^(https?:|tel:|mailto:)/i.test(h)) { e.preventDefault(); toast('В прототипе ссылка не открывается, ничего не отправляется'); }
  }, true);

  /* ---------- подсказка прокрутки у вкладок: у обрезанного ряда справа/слева появляется затухание ---------- */
  var tabRaf = 0;
  function tabHints() {
    tabRaf = 0;
    var L = d.querySelectorAll('.tabs__list');
    for (var i = 0; i < L.length; i++) {
      var el = L[i], more = el.scrollWidth > el.clientWidth + 2;
      el.toggleAttribute('data-more-r', more && el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
      el.toggleAttribute('data-more-l', more && el.scrollLeft > 2);
    }
  }
  function tabSchedule() { if (!tabRaf) tabRaf = w.requestAnimationFrame(tabHints); }
  d.addEventListener('scroll', tabSchedule, { capture: true, passive: true });
  w.addEventListener('resize', tabSchedule);
  new MutationObserver(tabSchedule).observe(d.documentElement, { childList: true, subtree: true });

  /* ---------- запуск ---------- */
  w.__hbToast = toast;
  var n0 = store.get('msg.unread');
  if (typeof n0 === 'number') w.__hbMsgN = n0;
  w.addEventListener('hb:msgunread', function (e) { store.set('msg.unread', e.detail); });
  store.subscribe(function (key) {
    if (key === 'facts.profile') { schedule(); return; }
    if (key && key !== '*' && key !== 'mode' && key.indexOf('hb-proto:') !== 0) persistPull(key);
  });

  function boot() {
    plaque();
    var cur = pick();
    show(cur).catch(function (e) { d.getElementById('root').textContent = 'Не удалось загрузить экран'; throw e; });
    var mq = w.matchMedia(NARROW);
    var swap = function () { var nx = pick(); if (!session || nx !== session.id) show(nx); };
    if (mq.addEventListener) mq.addEventListener('change', swap); else mq.addListener(swap);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})(window, document);
