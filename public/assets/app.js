if (String.prototype.trim === undefined) // fix for iOS 3.2
  String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

// For iOS 3.x
// from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
if (Array.prototype.reduce === undefined)
  Array.prototype.reduce = function(fun){
    if(this === void 0 || this === null) throw new TypeError();
    var t = Object(this), len = t.length >>> 0, k = 0, accumulator;
    if(typeof fun !== "function") throw new TypeError();
    if(len == 0 && arguments.length == 1) throw new TypeError();

    if(arguments.length >= 2)
     accumulator = arguments[1];
    else
      do{
        if(k in t){
          accumulator = t[k++];
          break;
        }
        if(++k >= len) throw new TypeError();
      } while (true);

    while (k < len){
      if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t);
      k++;
    }
    return accumulator;
  };
var Zepto = (function() {
  var slice = [].slice, key, css, $$, fragmentRE, container, document = window.document, undefined,
    getComputedStyle = document.defaultView.getComputedStyle;

  function classRE(name){ return new RegExp("(^|\\s)" + name + "(\\s|$)") }
  function compact(array){ return array.filter(function(item){ return item !== undefined && item !== null }) }
  function flatten(array){ return array.reduce(function(a,b){ return a.concat(b) }, []) }
  function camelize(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function uniq(array){
    var r = [];
    for(var i=0,n=array.length;i<n;i++)
      if(r.indexOf(array[i])<0) r.push(array[i]);
    return r;
  }

  fragmentRE = /^\s*<.+>/;
  container = document.createElement("div");
  function fragment(html) {
    container.innerHTML = ('' + html).trim();
    var result = slice.call(container.childNodes);
    container.innerHTML = '';
    return result;
  }

  function Z(dom, selector){
    dom = dom || [];
    dom.__proto__ = Z.prototype;
    dom.selector = selector || '';
    return dom;
  }

  function $(selector, context){
    if (selector == document) return Z();
    else if (context !== undefined) return $(context).find(selector);
    else if (typeof selector === 'function') return $(document).ready(selector);
    else if (selector instanceof Z) return selector;
    else {
      var dom;
      if (selector instanceof Array) dom = compact(selector);
      else if (selector instanceof Element || selector === window) dom = [selector];
      else if (fragmentRE.test(selector)) dom = fragment(selector);
      else dom = $$(document, selector);
      return Z(dom, selector);
    }
  }

  $.extend = function(target, source){ for (key in source) target[key] = source[key]; return target }
  $.qsa = $$ = function(element, selector){ return slice.call(element.querySelectorAll(selector)) }

  function filtered(nodes, selector){
    return selector === undefined ? $(nodes) : $(nodes).filter(selector);
  }

  $.fn = {
    forEach: [].forEach,
    map: [].map,
    reduce: [].reduce,
    push: [].push,
    indexOf: [].indexOf,
    concat: [].concat,
    ready: function(callback){
      document.addEventListener('DOMContentLoaded', callback, false); return this;
    },
    get: function(idx){ return idx === undefined ? this : this[idx] },
    size: function(){ return this.length },
    remove: function(){ return this.each(function(){ this.parentNode.removeChild(this) }) },
    each: function(callback){
      this.forEach(function(el, idx){ callback.call(el, idx, el) });
      return this;
    },
    filter: function(selector){
      return $([].filter.call(this, function(element){
        return $$(element.parentNode, selector).indexOf(element) >= 0;
      }));
    },
    is: function(selector){
      return this.length > 0 && $(this[0]).filter(selector).length > 0;
    },
    not: function(selector){
      var nodes=[];
      if (typeof selector == 'function' && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this);
        });
      else {
        var ignores = slice.call(
          typeof selector === "string" ?
            this.filter(selector) :
            selector instanceof NodeList ? selector : $(selector));
        slice.call(this).forEach(function(el){
          if (ignores.indexOf(el) < 0) nodes.push(el);
        });
      }
      return $(nodes);
    },
    eq: function(idx){ return $(this[idx]) },
    first: function(){ return $(this[0]) },
    last: function(){ return $(this[this.length - 1]) },
    find: function(selector){
      var result;
      if (this.length == 1) result = $$(this[0], selector);
      else result = flatten(this.map(function(el){ return $$(el, selector) }));
      return $(result);
    },
    closest: function(selector, context){
      var node = this[0], nodes = $$(context !== undefined ? context : document, selector);
      if (nodes.length === 0) node = null;
      while(node && node !== document && nodes.indexOf(node) < 0) node = node.parentNode;
      return $(node);
    },
    parents: function(selector){
      var ancestors = [], nodes = this;
      while (nodes.length > 0)
        nodes = compact(nodes.map(function(node){
          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node;
          }
        }));
      return filtered(ancestors, selector);
    },
    parent: function(selector){
      return filtered(uniq(compact(this.pluck('parentNode'))), selector);
    },
    children: function(selector){
      return filtered(flatten(this.map(function(el){ return slice.call(el.children) })), selector);
    },
    siblings: function(selector){
      return filtered(flatten(this.map(function(el){
        return slice.call(el.parentNode.children).filter(function(child){ return child!==el });
      })), selector);
    },
    pluck: function(property){ return this.map(function(element){ return element[property] }) },
    show: function(){ return this.css('display', 'block') },
    hide: function(){ return this.css('display', 'none') },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){ this.innerHTML = typeof html == 'function' ? html.call(this, idx, this.innerHTML) : html });
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].innerText : null) :
        this.each(function(){ this.innerText = text });
    },
    attr: function(name, value){
      return (typeof name == 'string' && value === undefined) ?
        (this.length > 0 && this[0].nodeName === 'INPUT' && this[0].type === 'text' && name === 'value') ? (this.val()) :
        (this.length > 0 ? this[0].getAttribute(name) || (name in this[0] ? this[0][name] : undefined) : null) :
        this.each(function(idx){
          if (typeof name == 'object') for (key in name) this.setAttribute(key, name[key])
          else this.setAttribute(name, typeof value == 'function' ? value.call(this, idx, this.getAttribute(name)) : value);
        });
    },
    removeAttr: function(name) {
      return this.each(function() { this.removeAttribute(name); });
    },
    data: function(name, value){
      return this.attr('data-' + name, value);
    },
    val: function(value){
      return (value === undefined) ?
        (this.length > 0 ? this[0].value : null) :
        this.each(function(){
          this.value = value;
        });
    },
    offset: function(){
      var obj = this[0].getBoundingClientRect();
      return {
        left: obj.left + document.body.scrollLeft,
        top: obj.top + document.body.scrollTop,
        width: obj.width,
        height: obj.height
      };
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string')
        return this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property);
      css = "";
      for (key in property) css += key + ':' + property[key] + ';';
      if (typeof property == 'string') css = property + ":" + value;
      return this.each(function() { this.style.cssText += ';' + css });
    },
    index: function(element){
      return this.indexOf($(element)[0]);
    },
    hasClass: function(name){
      return classRE(name).test(this[0].className);
    },
    addClass: function(name){
      return this.each(function(){
        !$(this).hasClass(name) && (this.className += (this.className ? ' ' : '') + name)
      });
    },
    removeClass: function(name){
      return this.each(function(){
        this.className = this.className.replace(classRE(name), ' ').trim()
      });
    },
    toggleClass: function(name, when){
      return this.each(function(){
       ((when !== undefined && !when) || $(this).hasClass(name)) ?
         $(this).removeClass(name) : $(this).addClass(name)
      });
    }
  };

  ['width', 'height'].forEach(function(property){
    $.fn[property] = function(){ return this.offset()[property] }
  });


  var adjacencyOperators = {append: 'beforeEnd', prepend: 'afterBegin', before: 'beforeBegin', after: 'afterEnd'};

  for (key in adjacencyOperators)
    $.fn[key] = (function(operator) {
      return function(html){
        return this.each(function(index, element){
          if (html instanceof Z) {
            dom = html;
            if (operator == "afterBegin" || operator == "afterEnd")
              for (var i=0; i<dom.length; i++) element['insertAdjacentElement'](operator, dom[dom.length-i-1]);
            else
              for (var i=0; i<dom.length; i++) element['insertAdjacentElement'](operator, dom[i]);
          } else {
            element['insertAdjacent'+(html instanceof Element ? 'Element' : 'HTML')](operator, html);
          }
        });
      };
    })(adjacencyOperators[key]);

  Z.prototype = $.fn;

  return $;
})();

'$' in window || (window.$ = Zepto);
(function($){
  var $$ = $.qsa, handlers = {}, _zid = 1;
  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event);
    if (event.ns) var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || handler.fn == fn)
        && (!selector || handler.sel == selector);
    });
  }
  function parse(event) {
    var parts = ('' + event).split('.');
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  }

  function add(element, events, fn, selector, delegate){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []));
    events.split(/\s/).forEach(function(event){
      var handler = $.extend(parse(event), {fn: fn, sel: selector, del: delegate, i: set.length});
      set.push(handler);
      element.addEventListener(handler.e, delegate || fn, false);
    });
  }
  function remove(element, events, fn, selector){
    var id = zid(element);
    (events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i];
        element.removeEventListener(handler.e, handler.del || handler.fn, false);
      });
    });
  }

  $.event = {
    add: function(element, events, fn){
      add(element, events, fn);
    },
    remove: function(element, events, fn){
      remove(element, events, fn);
    }
  };

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback);
    });
  };
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback);
    });
  };
  $.fn.one = function(event, callback){
    return this.each(function(){
      var self = this;
      add(this, event, function wrapper(){
        callback();
        remove(self, event, arguments.callee);
      });
    });
  };

  var eventMethods = ['preventDefault', 'stopImmediatePropagation', 'stopPropagation'];
  function createProxy(event) {
    var proxy = $.extend({originalEvent: event}, event);
    eventMethods.forEach(function(key) {
      proxy[key] = function() {return event[key].apply(event, arguments)};
    });
    return proxy;
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(e){
        var target = e.target, nodes = $$(element, selector);
        while (target && nodes.indexOf(target) < 0) target = target.parentNode;
        if (target && !(target === element) && !(target === document)) {
          callback.call(target, $.extend(createProxy(e), {
            currentTarget: target, liveFired: element
          }));
        }
      });
    });
  };
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector);
    });
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback);
    return this;
  };
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback);
    return this;
  };

  $.fn.trigger = function(event){
    return this.each(function(){
      var e = document.createEvent('Events');
      this.dispatchEvent(e, e.initEvent(event, true, true));
    });
  };
})(Zepto);
(function($){
  function detect(ua){
    var ua = ua, os = {},
      android = ua.match(/(Android)\s+([\d.]+)/),
      iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      webos = ua.match(/(webOS)\/([\d.]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
    if (android) os.android = true, os.version = android[2];
    if (iphone) os.ios = true, os.version = iphone[2].replace(/_/g, '.'), os.iphone = true;
    if (ipad) os.ios = true, os.version = ipad[2].replace(/_/g, '.'), os.ipad = true;
    if (webos) os.webos = true, os.version = webos[2];
    if (blackberry) os.blackberry = true, os.version = blackberry[2];
    return os;
  }
  $.os = detect(navigator.userAgent);
  $.__detect = detect;

  var v = navigator.userAgent.match(/WebKit\/([\d.]+)/);
  $.browser = v ? { webkit: true, version: v[1] } : { webkit: false };
})(Zepto);
(function($){
  $.fn.anim = function(properties, duration, ease, callback){
    var transforms = [], opacity, key;
    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

    typeof callback == 'function' && this.one('webkitTransitionEnd', callback);

    return this.css({
      '-webkit-transition': 'all ' + (duration !== undefined ? duration : 0.5) + 's ' + (ease || ''),
      '-webkit-transform': transforms.join(' '),
      opacity: opacity
    });
  }
})(Zepto);
(function($){
  var touch = {}, touchTimeout;

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }

  $(document).ready(function(){
    $(document.body).bind('touchstart', function(e){
      var now = Date.now(), delta = now - (touch.last || now);
      touch.target = parentIfText(e.touches[0].target);
      touchTimeout && clearTimeout(touchTimeout);
      touch.x1 = e.touches[0].pageX;
      touch.y1 = e.touches[0].pageY;
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      touch.last = now;
    }).bind('touchmove', function(e){
      touch.x2 = e.touches[0].pageX
      touch.y2 = e.touches[0].pageY
    }).bind('touchend', function(e){
      if (touch.isDoubleTap) {
        $(touch.target).trigger('doubleTap');
        touch = {};
      } else if (touch.x2 > 0 || touch.y2 > 0) {
        (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) && $(touch.target).trigger('swipe') &&
          $(touch.target).trigger('swipe' + (touch.x1 - touch.x2 > 0 ? 'Left' : 'Right'));
        touch.x1 = touch.x2 = touch.last = 0;
      } else if ('last' in touch) {
        touchTimeout = setTimeout(function(){
          touchTimeout = null;
          $(touch.target).trigger('tap')
          touch = {};
        }, 250);
      }
    }).bind('touchcancel', function(){ touch = {} });
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'doubleTap', 'tap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  });
})(Zepto);
(function($){
  var jsonpID = 0;

  function empty() {}

  $.ajaxJSONP = function(options){
    var jsonpString = 'jsonp' + ++jsonpID,
        script = document.createElement('script');
    window[jsonpString] = function(data){
      options.success(data);
      delete window.jsonpString;
    };
    script.src = options.url.replace(/=\?/, '=' + jsonpString);
    $('head').append(script);
  };

  $.ajax = function(options){
    // { type, url, data, success, dataType, contentType }
    options = options || {};

    if (options.url && /=\?/.test(options.url))
      return $.ajaxJSONP(options);

    var data = options.data,
        callback = options.success || empty,
        errback = options.error || empty,
        mime = mimeTypes[options.dataType],
        type = options.type || "GET",
        content = options.contentType || (type === "POST" ? "application/x-www-form-urlencoded" : ""),
        xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
          if (mime == 'application/json') {
            var result, error = false;
            try {
              result = JSON.parse(xhr.responseText);
            } catch (e) {
              error = e;
            }
            if (error) errback(xhr, 'parsererror', error);
            else callback(result, 'success', xhr);
          } else callback(xhr.responseText, 'success', xhr);
        } else {
          errback(xhr, 'error');
        }
      }
    };

    xhr.open(type, options.url || window.location, true);
    if (mime) xhr.setRequestHeader('Accept', mime);
    if (data instanceof Object) data = $.param(data);
    if (content) xhr.setRequestHeader('Content-Type', content);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(data);
  };

  var mimeTypes = $.ajax.mimeTypes = {
    json: 'application/json',
    xml:  'application/xml',
    html: 'text/html',
    text: 'text/plain'
  };

  $.get = function(url, success){ $.ajax({ url: url, success: success }) };
  $.post = function(url, data, success, dataType){
    if (data instanceof Function) dataType = dataType || success, success = data, data = null;
    $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };
  $.getJSON = function(url, success){ $.ajax({ url: url, success: success, dataType: 'json' }) };

  $.fn.load = function(url, success){
    if (!this.length) return this;
    var self = this, parts = url.split(/\s/), selector;
    if (parts.length > 1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response).find(selector).html()
        : response);
      success && success();
    });
    return this;
  };

  $.param = function(obj, v){
    var s = [],
        rec = '',
        add = function(key, value){
          if(v) s[s.length] = encodeURIComponent(v + "[" + key +"]") + '=' + encodeURIComponent(value);
          else s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        };
    for(var i in obj){
      if(obj[i] instanceof Array || obj[i] instanceof Object)
        rec += (s.length + rec.length > 0 ? '&' : '') + $.param(obj[i], (v ? v + "[" + i + "]" : i));
      else
        add(obj instanceof Array ? '' : i, obj[i]);
    };
    return s.join("&").replace(/%20/g, "+") + rec;
  };
})(Zepto);
(function($){
  var cache = [], timeout;

  $.fn.remove = function(){
    return this.each(function(){
      if(this.tagName == 'IMG'){
        cache.push(this);
        this.src = 'data:image/gif;base64,R0lGODlhAQABAAAAADs=';
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function(){ cache = [] }, 60000);
      }
      this.parentNode.removeChild(this);
    });
  }
})(Zepto);

//     Underscore.js 1.1.5
//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _;
    _._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.1.5';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects implementing `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (_.isNumber(obj.length)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial && index === 0) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) return breaker;
    });
    return result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    any(obj, function(value) {
      if (found = value === target) return true;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator = iterator || _.identity;
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return iterable;
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    var values = slice.call(arguments, 1);
    return _.filter(array, function(value){ return !_.include(values, value); });
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted) {
    return _.reduce(array, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo[memo.length] = el;
      return memo;
    }, []);
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  _.bind = function(func, obj) {
    if (nativeBind && func.bind === nativeBind) return func.bind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(obj, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher = hasher || _.identity;
    return function() {
      var key = hasher.apply(this, arguments);
      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        timeout = null;
        func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    return limit(func, wait, false);
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    return limit(func, wait, true);
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i=funcs.length-1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    return _.filter(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) obj[prop] = source[prop];
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) if (obj[prop] == null) obj[prop] = source[prop];
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return false;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
  };

  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
  // that does not equal itself.
  _.isNaN = function(obj) {
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();

//     Backbone.js 0.3.3
//     (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://documentcloud.github.com/backbone

(function(){

  // Initial Setup
  // -------------

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = this.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.3.3';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = this._;
  if (!_ && (typeof require !== 'undefined')) _ = require("underscore")._;

  // For Backbone's purposes, either jQuery or Zepto owns the `$` variable.
  var $ = this.jQuery || this.Zepto;

  // Turn on `emulateHTTP` to use support legacy HTTP servers. Setting this option will
  // fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and set a
  // `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may `bind` or `unbind` a callback function to an event;
  // `trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.bind('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback` function.
    // Passing `"all"` will bind the callback to all events fired.
    bind : function(ev, callback) {
      var calls = this._callbacks || (this._callbacks = {});
      var list  = this._callbacks[ev] || (this._callbacks[ev] = []);
      list.push(callback);
      return this;
    },

    // Remove one or many callbacks. If `callback` is null, removes all
    // callbacks for the event. If `ev` is null, removes all bound callbacks
    // for all events.
    unbind : function(ev, callback) {
      var calls;
      if (!ev) {
        this._callbacks = {};
      } else if (calls = this._callbacks) {
        if (!callback) {
          calls[ev] = [];
        } else {
          var list = calls[ev];
          if (!list) return this;
          for (var i = 0, l = list.length; i < l; i++) {
            if (callback === list[i]) {
              list.splice(i, 1);
              break;
            }
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger : function(ev) {
      var list, calls, i, l;
      if (!(calls = this._callbacks)) return this;
      if (list = calls[ev]) {
        for (i = 0, l = list.length; i < l; i++) {
          list[i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
      }
      if (list = calls['all']) {
        for (i = 0, l = list.length; i < l; i++) {
          list[i].apply(this, arguments);
        }
      }
      return this;
    }

  };

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    attributes || (attributes = {});
    if (this.defaults) attributes = _.extend({}, this.defaults, attributes);
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.set(attributes, {silent : true});
    this._previousAttributes = _.clone(this.attributes);
    if (options && options.collection) this.collection = options.collection;
    this.initialize(attributes, options);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // A snapshot of the model's previous attributes, taken immediately
    // after the last `"change"` event was fired.
    _previousAttributes : null,

    // Has the item been changed since the last `"change"` event?
    _changed : false,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Return a copy of the model's `attributes` object.
    toJSON : function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get : function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape : function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = escapeHTML(val == null ? '' : val);
    },

    // Set a hash of model attributes on the object, firing `"change"` unless you
    // choose to silence it.
    set : function(attrs, options) {

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs.attributes) attrs = attrs.attributes;
      var now = this.attributes, escaped = this._escapedAttributes;

      // Run validation.
      if (!options.silent && this.validate && !this._performValidation(attrs, options)) return false;

      // Check for changes of `id`.
      if ('id' in attrs) this.id = attrs.id;

      // Update attributes.
      for (var attr in attrs) {
        var val = attrs[attr];
        if (!_.isEqual(now[attr], val)) {
          now[attr] = val;
          delete escaped[attr];
          if (!options.silent) {
            this._changed = true;
            this.trigger('change:' + attr, this, val, options);
          }
        }
      }

      // Fire the `"change"` event, if the model has been changed.
      if (!options.silent && this._changed) this.change(options);
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it.
    unset : function(attr, options) {
      options || (options = {});
      var value = this.attributes[attr];

      // Run validation.
      var validObj = {};
      validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      // Remove the attribute.
      delete this.attributes[attr];
      delete this._escapedAttributes[attr];
      if (!options.silent) {
        this._changed = true;
        this.trigger('change:' + attr, this, void 0, options);
        this.change(options);
      }
      return this;
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear : function(options) {
      options || (options = {});
      var old = this.attributes;

      // Run validation.
      var validObj = {};
      for (attr in old) validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      this.attributes = {};
      this._escapedAttributes = {};
      if (!options.silent) {
        this._changed = true;
        for (attr in old) {
          this.trigger('change:' + attr, this, void 0, options);
        }
        this.change(options);
      }
      return this;
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch : function(options) {
      options || (options = {});
      var model = this;
      var success = function(resp) {
        if (!model.set(model.parse(resp), options)) return false;
        if (options.success) options.success(model, resp);
      };
      var error = wrapError(options.error, model, options);
      (this.sync || Backbone.sync)('read', this, success, error);
      return this;
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save : function(attrs, options) {
      options || (options = {});
      if (attrs && !this.set(attrs, options)) return false;
      var model = this;
      var success = function(resp) {
        if (!model.set(model.parse(resp), options)) return false;
        if (options.success) options.success(model, resp);
      };
      var error = wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      (this.sync || Backbone.sync)(method, this, success, error);
      return this;
    },

    // Destroy this model on the server. Upon success, the model is removed
    // from its collection, if it has one.
    destroy : function(options) {
      options || (options = {});
      var model = this;
      var success = function(resp) {
        if (model.collection) model.collection.remove(model);
        if (options.success) options.success(model, resp);
      };
      var error = wrapError(options.error, model, options);
      (this.sync || Backbone.sync)('delete', this, success, error);
      return this;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url : function() {
      var base = getUrl(this.collection);
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse : function(resp) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone : function() {
      return new this.constructor(this);
    },

    // A model is new if it has never been saved to the server, and has a negative
    // ID.
    isNew : function() {
      return !this.id;
    },

    // Call this method to manually fire a `change` event for this model.
    // Calling this will cause all objects observing the model to update.
    change : function(options) {
      this.trigger('change', this, options);
      this._previousAttributes = _.clone(this.attributes);
      this._changed = false;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged : function(attr) {
      if (attr) return this._previousAttributes[attr] != this.attributes[attr];
      return this._changed;
    },

    // Return an object containing all the attributes that have changed, or false
    // if there are no changed attributes. Useful for determining what parts of a
    // view need to be updated and/or what attributes need to be persisted to
    // the server.
    changedAttributes : function(now) {
      now || (now = this.attributes);
      var old = this._previousAttributes;
      var changed = false;
      for (var attr in now) {
        if (!_.isEqual(old[attr], now[attr])) {
          changed = changed || {};
          changed[attr] = now[attr];
        }
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous : function(attr) {
      if (!attr || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes : function() {
      return _.clone(this._previousAttributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _performValidation : function(attrs, options) {
      var error = this.validate(attrs);
      if (error) {
        if (options.error) {
          options.error(this, error);
        } else {
          this.trigger('error', this, error, options);
        }
        return false;
      }
      return true;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) {
      this.comparator = options.comparator;
      delete options.comparator;
    }
    this._boundOnModelEvent = _.bind(this._onModelEvent, this);
    this._reset();
    if (models) this.refresh(models, {silent: true});
    this.initialize(models, options);
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model : Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `added` event for every new model.
    add : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._add(models[i], options);
        }
      } else {
        this._add(models, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `removed` event for every model removed.
    remove : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._remove(models[i], options);
        }
      } else {
        this._remove(models, options);
      }
      return this;
    },

    // Get a model from the set by id.
    get : function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid : function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under normal
    // circumstances, as the set will maintain sort order as each item is added.
    sort : function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      this.models = this.sortBy(this.comparator);
      if (!options.silent) this.trigger('refresh', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck : function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can refresh the entire set with a new list of models, without firing
    // any `added` or `removed` events. Fires `refresh` when finished.
    refresh : function(models, options) {
      models  || (models = []);
      options || (options = {});
      this._reset();
      this.add(models, {silent: true});
      if (!options.silent) this.trigger('refresh', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, refreshing the
    // collection when they arrive.
    fetch : function(options) {
      options || (options = {});
      var collection = this;
      var success = function(resp) {
        collection.refresh(collection.parse(resp));
        if (options.success) options.success(collection, resp);
      };
      var error = wrapError(options.error, collection, options);
      (this.sync || Backbone.sync)('read', this, success, error);
      return this;
    },

    // Create a new instance of a model in this collection. After the model
    // has been created on the server, it will be added to the collection.
    create : function(model, options) {
      var coll = this;
      options || (options = {});
      if (!(model instanceof Backbone.Model)) {
        model = new this.model(model, {collection: coll});
      } else {
        model.collection = coll;
      }
      var success = function(nextModel, resp) {
        coll.add(nextModel);
        if (options.success) options.success(nextModel, resp);
      };
      return model.save(null, {success : success, error : options.error});
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse : function(resp) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is refreshed.
    _reset : function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Internal implementation of adding a single model to the set, updating
    // hash indexes for `id` and `cid` lookups.
    _add : function(model, options) {
      options || (options = {});
      if (!(model instanceof Backbone.Model)) {
        model = new this.model(model, {collection: this});
      }
      var already = this.getByCid(model);
      if (already) throw new Error(["Can't add the same model to a set twice", already.id]);
      this._byId[model.id] = model;
      this._byCid[model.cid] = model;
      model.collection = this;
      var index = this.comparator ? this.sortedIndex(model, this.comparator) : this.length;
      this.models.splice(index, 0, model);
      model.bind('all', this._boundOnModelEvent);
      this.length++;
      if (!options.silent) model.trigger('add', model, this, options);
      return model;
    },

    // Internal implementation of removing a single model from the set, updating
    // hash indexes for `id` and `cid` lookups.
    _remove : function(model, options) {
      options || (options = {});
      model = this.getByCid(model) || this.get(model);
      if (!model) return null;
      delete this._byId[model.id];
      delete this._byCid[model.cid];
      delete model.collection;
      this.models.splice(this.indexOf(model), 1);
      this.length--;
      if (!options.silent) model.trigger('remove', model, this, options);
      model.unbind('all', this._boundOnModelEvent);
      return model;
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through.
    _onModelEvent : function(ev, model) {
      if (ev === 'change:id') {
        delete this._byId[model.previous('id')];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect',
    'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
    'first', 'rest', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Controller
  // -------------------

  // Controllers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Controller = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize(options);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam = /:([\w\d]+)/g;
  var splatParam = /\*([\w\d]+)/g;

  // Set up all inheritable **Backbone.Controller** properties and methods.
  _.extend(Backbone.Controller.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route : function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
      }, this));
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history,
    // without triggering routes.
    saveLocation : function(fragment) {
      Backbone.history.saveLocation(fragment);
    },

    // Bind all defined routes to `Backbone.history`.
    _bindRoutes : function() {
      if (!this.routes) return;
      for (var route in this.routes) {
        var name = this.routes[route];
        this.route(route, name, this[name]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location fragment.
    _routeToRegExp : function(route) {
      route = route.replace(namedParam, "([^\/]*)").replace(splatParam, "(.*?)");
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters : function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL hashes. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    this.fragment = this.getFragment();
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning hashes.
  var hashStrip = /^#*/;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment.
    getFragment : function(loc) {
      return (loc || window.location).hash.replace(hashStrip, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start : function() {
      var docMode = document.documentMode;
      var oldIE = ($.browser.msie && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
      }
      if ('onhashchange' in window && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else {
        setInterval(this.checkUrl, this.interval);
      }
      return this.loadUrl();
    },

    // Add a route to be tested when the hash changes. Routes are matched in the
    // order they are added.
    route : function(route, callback) {
      this.handlers.push({route : route, callback : callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl : function() {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) {
        current = this.getFragment(this.iframe.location);
      }
      if (current == this.fragment ||
          current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) {
        window.location.hash = this.iframe.location.hash = current;
      }
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl : function() {
      var fragment = this.fragment = this.getFragment();
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history. You are responsible for properly
    // URL-encoding the fragment in advance. This does not trigger
    // a `hashchange` event.
    saveLocation : function(fragment) {
      fragment = (fragment || '').replace(hashStrip, '');
      if (this.fragment == fragment) return;
      window.location.hash = this.fragment = fragment;
      if (this.iframe && (fragment != this.getFragment(this.iframe.location))) {
        this.iframe.document.open().close();
        this.iframe.location.hash = fragment;
      }
    }

  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this._configure(options || {});
    this._ensureElement();
    this.delegateEvents();
    this.initialize(options);
  };

  // Element lookup, scoped to DOM elements within the current view.
  // This should be prefered to global lookups, if you're dealing with
  // a specific view.
  var selectorDelegate = function(selector) {
    return $(selector, this.el);
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\w+)\s*(.*)$/;

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName : 'div',

    // Attach the `selectorDelegate` function as the `$` property.
    $       : selectorDelegate,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render : function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove : function() {
      $(this.el).remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make : function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Set callbacks, where `this.callbacks` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents : function(events) {
      if (!(events || (events = this.events))) return;
      $(this.el).unbind();
      for (var key in events) {
        var methodName = events[key];
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        var method = _.bind(this[methodName], this);
        if (selector === '') {
          $(this.el).bind(eventName, method);
        } else {
          $(this.el).delegate(selector, eventName, method);
        }
      }
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure : function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      if (options.model)      this.model      = options.model;
      if (options.collection) this.collection = options.collection;
      if (options.el)         this.el         = options.el;
      if (options.id)         this.id         = options.id;
      if (options.className)  this.className  = options.className;
      if (options.tagName)    this.tagName    = options.tagName;
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    _ensureElement : function() {
      if (this.el) return;
      var attrs = {};
      if (this.id) attrs.id = this.id;
      if (this.className) attrs["class"] = this.className;
      this.el = this.make(this.tagName, attrs);
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Controller.extend = Backbone.View.extend = extend;

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, uses makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded` instead of
  // `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, success, error) {
    var type = methodMap[method];
    var modelJSON = (method === 'create' || method === 'update') ?
                    JSON.stringify(model.toJSON()) : null;

    // Default JSON-request options.
    var params = {
      url:          getUrl(model),
      type:         type,
      contentType:  'application/json',
      data:         modelJSON,
      dataType:     'json',
      processData:  false,
      success:      success,
      error:        error
    };

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.processData = true;
      params.data        = modelJSON ? {model : modelJSON} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader("X-HTTP-Method-Override", type);
        };
      }
    }

    // Make the request.
    $.ajax(params);
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`, for `instanceof`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a URL from a Model or Collection as a property
  // or as a function.
  var getUrl = function(object) {
    if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
    return _.isFunction(object.url) ? object.url() : object.url;
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(onError, model, options) {
    return function(resp) {
      if (onError) {
        onError(model, resp);
      } else {
        model.trigger('error', model, resp, options);
      }
    };
  };

  // Helper function to escape a string for HTML rendering.
  var escapeHTML = function(string) {
    return string.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

})();

(function() {
  var Tile;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Tile = (function() {
    __extends(Tile, Backbone.Model);
    function Tile() {
      Tile.__super__.constructor.apply(this, arguments);
    }
    Tile.prototype.initialize = function() {
      if (!this.get('empty')) {
        return this.set({
          empty: false
        });
      }
    };
    Tile.prototype.position = function() {
      return this.get('position');
    };
    Tile.prototype.isEmpty = function() {
      return this.get('empty');
    };
    Tile.prototype.play = function() {
      var newPos;
      newPos = this.collection.emptyTilePosition();
      this.collection.emptyTile().set({
        position: this.position()
      }, {
        silent: true
      });
      return this.set({
        position: newPos
      });
    };
    Tile.prototype.canBePlayed = function() {
      var boardSize, delta, emptyPos, tilePos;
      boardSize = this.collection.SIZE;
      tilePos = this.position();
      emptyPos = this.collection.emptyTilePosition();
      delta = Math.abs(this.position() - emptyPos);
      if (delta === 1 || delta === boardSize) {
        if (emptyPos % boardSize === 0 && this.position === (emptyPos - 1)) {
          return false;
        } else if ((emptyPos + 1) % boardSize === 0 && this.position === (emptyPos + 1)) {
          return false;
        } else {
          return {
            real: this.position - emptyPos,
            delta: delta
          };
        }
      } else {
        return false;
      }
    };
    return Tile;
  })();
  window.Tile = Tile;
}).call(this);

(function() {
  var Board;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Board = (function() {
    __extends(Board, Backbone.Collection);
    function Board() {
      Board.__super__.constructor.apply(this, arguments);
    }
    Board.prototype.SIZE = 4;
    Board.prototype.model = Tile;
    Board.prototype.initialize = function() {
      return this.reset();
    };
    Board.prototype.reset = function() {
      var i, tiles, _ref;
      tiles = [];
      for (i = 0, _ref = this.SIZE * this.SIZE; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        tiles.push(new this.model({
          label: i + 1,
          position: i,
          solution: i
        }));
      }
      _.last(tiles).set({
        empty: true
      });
      return this.refresh(tiles, {
        silent: true
      });
    };
    Board.prototype.shuffle = function() {
      var positions;
      positions = this.pluck('position').sort(function() {
        return 0.5 - Math.random();
      });
      _.each(positions, __bind(function(pos, i) {
        return this.models[i].set({
          'position': pos
        });
      }, this));
      return this.trigger('refresh');
    };
    Board.prototype.emptyTile = function() {
      return this.find(function(tile) {
        return tile.isEmpty();
      });
    };
    Board.prototype.emptyTilePosition = function() {
      return this.emptyTile().get('position');
    };
    Board.prototype.solved = function() {
      var actual, solution;
      actual = this.pluck('position');
      solution = this.pluck('solution');
      return actual.toString() === solution.toString();
    };
    return Board;
  })();
  window.Board = Board;
}).call(this);

(function() {
  var Game;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Game = (function() {
    __extends(Game, Backbone.Model);
    function Game() {
      Game.__super__.constructor.apply(this, arguments);
    }
    Game.prototype.initialize = function() {
      this.board = new Board();
      return this.set({
        moves: 0
      });
    };
    Game.prototype.newGame = function() {
      this.board.shuffle();
      return this.set({
        moves: 0
      });
    };
    return Game;
  })();
  window.Game = Game;
}).call(this);

(function() {
  var TileView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  TileView = (function() {
    __extends(TileView, Backbone.View);
    function TileView() {
      TileView.__super__.constructor.apply(this, arguments);
    }
    TileView.prototype.WIDTH = 144;
    TileView.prototype.HEIGHT = 136;
    TileView.prototype.tagName = 'li';
    TileView.prototype.className = 'b-tile';
    TileView.prototype.template = _.template("<p><%= label %></p>");
    TileView.prototype.events = {
      'click': 'play',
      'tap': 'play',
      'touchstart': 'dragTileStart',
      'touchmove': 'dragTileMove',
      'touchend': 'dragTileEnd'
    };
    TileView.prototype.sound = new Audio('sounds/tink.mp3');
    TileView.prototype.initialize = function() {
      _.bindAll(this, 'render', 'playTile', 'dragTileStart', 'dragTileMove', 'dragTileEnd');
      this.model.bind('change', this.render);
      return this.model.view = this;
    };
    TileView.prototype.render = function() {
      var board, left, tileData, top;
      board = this.model.collection;
      tileData = this.model.toJSON();
      $(this.el).html(this.template(tileData));
      if (tileData.empty) {
        $(this.el).addClass('b-tile_empty');
      }
      left = (tileData.position % board.SIZE) * this.WIDTH;
      top = (Math.ceil((tileData.position + 1) / board.SIZE) - 1) * this.HEIGHT;
      $(this.el).css({
        'z-index': tileData.position
      }).anim({
        translate3d: "" + left + "px, " + top + "px, 0"
      }, 0.125, "ease-out");
      return this;
    };
    TileView.prototype.play = function() {
      if (this.model.canBePlayed()) {
        this.model.play();
        this.sound.play();
        return game.set({
          moves: game.get('moves') + 1
        });
      }
    };
    TileView.prototype.dragTileStart = function(e) {
      var delta, diff, emptyPos, tilePos;
      this.touch = {};
      this.touch.x1 = e.touches[0].pageX;
      this.touch.y1 = e.touches[0].pageY;
      if (this.model.canBePlayed()) {
        this.playing = true;
        tilePos = this.model.position();
        emptyPos = this.model.collection.emptyTilePosition();
        diff = tilePos - emptyPos;
        delta = Math.abs(diff);
        this.horizontal = delta === 1;
        if (diff < 0 && this.horizontal) {
          this.moveDirection = 'right';
        }
        if (diff > 0 && this.horizontal) {
          this.moveDirection = 'left';
        }
        if (diff < 0 && !this.horizontal) {
          this.moveDirection = 'down';
        }
        if (diff > 0 && !this.horizontal) {
          this.moveDirection = 'up';
        }
        return this.originalTransform = _.map($(this.el).css('-webkit-transform').replace('translate3d(', '').split(','), function(component) {
          return parseFloat(component);
        });
      }
    };
    TileView.prototype.dragTileMove = function(e) {
      var tileX, tileY;
      if (!this.playing) {
        return false;
      }
      this.touch.x2 = e.touches[0].pageX;
      this.touch.y2 = e.touches[0].pageY;
      this.deltaX = this.touch.x2 - this.touch.x1;
      this.deltaY = this.touch.y2 - this.touch.y1;
      tileX = this.originalTransform[0];
      tileY = this.originalTransform[1];
      switch (this.moveDirection) {
        case "left":
          this.deltaX = Math.max(Math.min(this.deltaX, 0), -this.WIDTH);
          break;
        case "right":
          this.deltaX = Math.min(Math.max(this.deltaX, 0), this.WIDTH);
          break;
        case "up":
          this.deltaY = Math.max(Math.min(this.deltaY, 0), -this.HEIGHT);
          break;
        case "down":
          this.deltaY = Math.min(Math.max(this.deltaY, 0), this.HEIGHT);
      }
      if (this.horizontal) {
        tileX += this.deltaX;
      } else {
        tileY += this.deltaY;
      }
      return $(this.el).css({
        '-webkit-transform': "translate3d(" + tileX + "px, " + tileY + "px, 0)"
      });
    };
    TileView.prototype.dragTileEnd = function() {
      if (!this.playing) {
        return false;
      }
      if (Math.abs(this.deltaX) > this.WIDTH / 2 || Math.abs(this.deltaY) > this.HEIGHT / 2) {
        this.play();
      } else {
        $(this.el).anim({
          translate3D: "" + this.originalTransform[0] + "px, " + this.originalTransform[1] + "px, 0"
        }, 0.125, "ease-out");
      }
      this.playing = false;
      return this.originalTransform = [];
    };
    return TileView;
  })();
  window.TileView = TileView;
}).call(this);

(function() {
  var BoardView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BoardView = (function() {
    __extends(BoardView, Backbone.View);
    function BoardView() {
      BoardView.__super__.constructor.apply(this, arguments);
    }
    BoardView.prototype.tagName = 'ul';
    BoardView.prototype.className = 'b-board';
    BoardView.prototype.initialize = function() {
      _.bindAll(this, 'render', 'addTile', 'addTiles');
      this.model.bind('refresh', this.render);
      this.model.bind('change', this.checkSolved);
      this.model.view = this;
      return this.model.shuffle();
    };
    BoardView.prototype.render = function() {
      $(this.el).html('');
      this.addTiles();
      return this;
    };
    BoardView.prototype.addTile = function(tile) {
      var view;
      view = new TileView({
        model: tile
      });
      return $(this.el).append(view.render().el);
    };
    BoardView.prototype.addTiles = function() {
      return this.model.each(this.addTile);
    };
    BoardView.prototype.checkSolved = function() {
      if (this.solved()) {
        return game.set({
          solved: true
        });
      }
    };
    return BoardView;
  })();
  window.BoardView = BoardView;
}).call(this);

(function() {
  var GameView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  GameView = (function() {
    __extends(GameView, Backbone.View);
    function GameView() {
      GameView.__super__.constructor.apply(this, arguments);
    }
    GameView.prototype.el = $("#gameview");
    GameView.prototype.events = {
      'click #new_game': 'newGame'
    };
    GameView.prototype.initialize = function() {
      var view;
      _.bindAll(this, 'render', 'updateStats');
      this.model.bind('change:solved', this.gameSolved);
      this.model.bind('change', this.updateStats);
      view = new BoardView({
        model: this.model.board
      });
      return this.el.append(view.render().el);
    };
    GameView.prototype.newGame = function() {
      if (window.confirm("Are you sure you want to start a new game")) {
        return this.model.newGame();
      }
    };
    GameView.prototype.gameSolved = function() {
      return alert("Congratulations! You solved the puzzle in " + (this.model.get('moved')) + " moves.");
    };
    GameView.prototype.updateStats = function() {
      return this.$('#moves_count').html(this.model.get('moves'));
    };
    return GameView;
  })();
  window.GameView = GameView;
}).call(this);

// 
//  fifteens.js
//  
//  Created by Andrew Okonetchnikov on 2011-04-10.
//  Copyright 2011 okonet.ru. All rights reserved.
// 

$(function(){
  
  window.game = new Game();
  window.gameView = new GameView({ model: game });
  
});