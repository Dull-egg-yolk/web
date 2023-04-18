var t; var n; var r; var a; var o; var i; var u; var l; var s; var f; var d; var p; var v; var y; var h; var m = {
  bgColor: '#d00',
  textColor: '#fff',
  fontFamily: 'sans-serif',
  fontStyle: 'bold',
  type: 'circle',
  position: 'down',
  animation: 'none',
  elementId: !1,
  dataUrl: !1,
  win: window
};
(p = {}).ff = typeof InstallTrigger !== 'undefined';
p.chrome = !!window.chrome;
p.opera = !!window.opera || navigator.userAgent.indexOf('Opera') >= 0;
p.safari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
p.supported = p.chrome || p.ff || p.opera;

var _ = [];
d = function () {};

l = !1;
var g = {
  ready: function () {
    l = !0;
    g.reset();
    d();
  },
  reset: function () {
    if (l) {
      i.clearRect(0, 0, a, r);
      i.drawImage(u, 0, 0, a, r);
      b.setIcon(o);
      window.clearTimeout(v);
      window.clearTimeout(y);
    }
  },
  start: function () {
    if (l && !f && _.length > 0) {
      f = !0;
      var e = function () {
        T.run(_[0].options, function () {
          // eslint-disable-next-line no-unused-expressions
          !(function () {
            s = _[0];
            f = !1;
            if (_.length > 0) {
              _.shift();
              g.start();
            }
          }());
        }
        , !1);
      };
      s ? T.run(s.options, function () {
        e();
      }, !0) : e();
    }
  }
};
var S = function (e) {
  e.n = typeof e.n === 'number' ? Math.abs(0 | e.n) : e.n;
  e.x = a * e.x;
  e.y = r * e.y;
  e.w = a * e.w;
  e.h = r * e.h;
  e.len = ('' + e.n).length;
  return e;
};

var E = {};
E.circle = function (e) {
  var n = !1;
  if ((e = S(e)).len === 2) {
    e.x = e.x - 0.4 * e.w;
    e.w = 1.4 * e.w;
    n = !0;
  } else if (e.len >= 3) {
    e.x = e.x - 0.65 * e.w;
    e.w = 1.65 * e.w;
    n = !0;
  }
  i.clearRect(0, 0, a, r);
  i.drawImage(u, 0, 0, a, r);
  i.beginPath();
  i.font = t.fontStyle + ' ' + Math.floor(e.h * (e.n > 99 ? 0.85 : 1)) + 'px ' + t.fontFamily;
  i.textAlign = 'center';
  if (n) {
    i.moveTo(e.x + e.w / 2, e.y);
    i.lineTo(e.x + e.w - e.h / 2, e.y);
    i.quadraticCurveTo(e.x + e.w, e.y, e.x + e.w, e.y + e.h / 2);
    i.lineTo(e.x + e.w, e.y + e.h - e.h / 2);
    i.quadraticCurveTo(e.x + e.w, e.y + e.h, e.x + e.w - e.h / 2, e.y + e.h);
    i.lineTo(e.x + e.h / 2, e.y + e.h);
    i.quadraticCurveTo(e.x, e.y + e.h, e.x, e.y + e.h - e.h / 2);
    i.lineTo(e.x, e.y + e.h / 2);
    i.quadraticCurveTo(e.x, e.y, e.x + e.h / 2, e.y);
  } else { i.arc(e.x + e.w / 2, e.y + e.h / 2, e.h / 2, 0, 2 * Math.PI); }
  i.fillStyle = 'rgba(' + t.bgColor.r + ',' + t.bgColor.g + ',' + t.bgColor.b + ',' + e.o + ')';
  i.fill();
  i.closePath();
  i.beginPath();
  i.stroke();
  i.fillStyle = 'rgba(' + t.textColor.r + ',' + t.textColor.g + ',' + t.textColor.b + ',' + e.o + ')';
  typeof e.n === 'number' && e.n > 999 ? i.fillText((e.n > 9999 ? 9 : Math.floor(e.n / 1e3)) + 'k+', Math.floor(e.x + e.w / 2), Math.floor(e.y + e.h - 0.2 * e.h)) : i.fillText(e.n, Math.floor(e.x + e.w / 2), Math.floor(e.y + e.h - 0.15 * e.h));
  i.closePath();
};

var b = {
  getIcon: function () {
    var e = !1;
    if (t.element) { e = t.element; } else if (t.elementId) { (e = h.getElementById(t.elementId)).setAttribute('href', e.getAttribute('src')); } else {
      e = (function () {
        for (var e = h.getElementsByTagName('head')[0].getElementsByTagName('link'), t = e.length - 1; t >= 0; t--) {
          if (/(^|\s)icon(\s|$)/i.test(e[t].getAttribute('rel'))) { return e[t]; }
        }
        return !1;
      }());
      if (!1 === e) {
        (e = h.createElement('link')).setAttribute('rel', 'icon');
        h.getElementsByTagName('head')[0].appendChild(e);
      }
    }
    e.setAttribute('type', 'image/png');
    return e;
  },
  setIcon: function (e) {
    var r = e.toDataURL('image/png');
    t.dataUrl && t.dataUrl(r);
    if (t.element) {
      t.element.setAttribute('href', r);
      t.element.setAttribute('src', r);
    } else if (t.elementId) {
      var a = h.getElementById(t.elementId);
      a.setAttribute('href', r);
      a.setAttribute('src', r);
    } else if (p.ff || p.opera) {
      var o = n;
      n = h.createElement('link');
      p.opera && n.setAttribute('rel', 'icon');
      n.setAttribute('rel', 'icon');
      n.setAttribute('type', 'image/png');
      h.getElementsByTagName('head')[0].appendChild(n);
      n.setAttribute('href', r);
      o.parentNode && o.parentNode.removeChild(o);
    } else {
      n.setAttribute('href', r);
    }
  }
};
function I (e) {
  e = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (e, t, n, r) {
    return t + t + n + n + r + r;
  }
  );
  var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
  return !!t && {
    r: parseInt(t[1], 16),
    g: parseInt(t[2], 16),
    b: parseInt(t[3], 16)
  };
}

function C (e, t) {
  var n; var r = {};
  for (n in e) { r[n] = e[n]; }
  for (n in t) { r[n] = t[n]; }
  return r;
}
var T = {
  duration: 40,
  types: {}
};

T.types.none = [{ x: 0.4, y: 0.4, w: 0.6, h: 0.6, o: 1 }];

/**
 *
 * @param {object} e {n:1}
 * @param {function} fun
 * @param {boolean} r false
 * @param {number} a 0
 */
T.run = function (e, fun, r, a) {
  var i = T.types[t.animation];
  a = !0 === r ? undefined !== a ? a : i.length - 1 : undefined !== a ? a : 0;
  fun = fun || function () {};

  if (a < i.length && a >= 0) {
    E[t.type](C(e, i[a]));
    v = setTimeout(function () {
      r ? a -= 1 : a += 1;
      T.run(e, fun, r, a);
    }, T.duration);
    b.setIcon(o);
  } else { fun(); }
};

export function init () {
  (t = C(m)).bgColor = I(t.bgColor);
  t.textColor = I(t.textColor);
  h = t.win.document;
  n = b.getIcon();
  o = document.createElement('canvas');
  u = document.createElement('img');
  if (n.hasAttribute('href')) {
    u.setAttribute('crossOrigin', 'anonymous');
    u.onload = function () {
      r = u.height > 0 ? u.height : 32;
      a = u.width > 0 ? u.width : 32;
      o.height = r;
      o.width = a;
      i = o.getContext('2d');
      g.ready();
    };

    u.setAttribute('src', n.getAttribute('href'));
  } else {
    u.onload = function () {
      r = 32;
      a = 32;
      u.height = r;
      u.width = a;
      o.height = r;
      o.width = a;
      i = o.getContext('2d');
      g.ready();
    };

    u.setAttribute('src', '');
  }
}

export const badge = function (e) {
  d = function () {
    try {
      if (typeof e === 'number' ? e > 0 : e !== '') {
        var n = {
          type: 'badge',
          options: {
            n: e
          }
        };
        _.push(n);
        if (_.length > 100) { throw new Error('Too many badges requests in queue.'); }
        g.start();
      } else {
        g.reset();
      }
    } catch (e) {
      throw new Error('Error setting badge. Message: ' + e.message);
    }
  };
  l && d();
};
