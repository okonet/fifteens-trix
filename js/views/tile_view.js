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
        return this.sound.play();
      }
    };
    TileView.prototype.dragTileStart = function(e) {
      var canBePlayed;
      this.touch = {};
      this.touch.x1 = e.touches[0].pageX;
      this.touch.y1 = e.touches[0].pageY;
      canBePlayed = this.model.canBePlayed();
      if (canBePlayed) {
        this.playing = true;
        this.horizontal = canBePlayed.delta === 1;
        this.moveTo = this.horizontal && canBePlayed.real < 0 ? 'right' : (this.horizontal && canBePlayed.real > 0 ? 'left' : void 0, !this.horizontal && canBePlayed.real < 0 ? 'bottom' : void 0, !this.horizontal && canBePlayed.real > 0 ? 'top' : false);
        return this.originalTransform = _.map($(this.el).css('-webkit-transform').replace('translate3d(', '').split(','), function(component) {
          return parseFloat(component);
        });
      }
    };
    TileView.prototype.dragTileMove = function(e) {
      var visibleX, visibleY;
      if (!this.playing) {
        return false;
      }
      this.touch.x2 = e.touches[0].pageX;
      this.touch.y2 = e.touches[0].pageY;
      this.deltaX = this.touch.x2 - this.touch.x1;
      this.deltaY = this.touch.y2 - this.touch.y1;
      visibleX = this.originalTransform[0];
      visibleY = this.originalTransform[1];
      switch (this.moveTo) {
        case "left":
          this.deltaX = Math.max(Math.min(this.deltaX, 0), -this.WIDTH);
          break;
        case "right":
          this.deltaX = Math.min(Math.max(this.deltaX, 0), this.WIDTH);
          break;
        case "top":
          this.deltaY = Math.max(Math.min(this.deltaY, 0), -this.HEIGHT);
          break;
        case "bottom":
          this.deltaY = Math.min(Math.max(this.deltaY, 0), this.HEIGHT);
      }
      if (this.horizontal) {
        visibleX += this.deltaX;
      } else {
        visibleY += this.deltaY;
      }
      return $(this.el).css({
        '-webkit-transform': "translate3d(" + visibleX + "px, " + visibleY + "px, 0)"
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
