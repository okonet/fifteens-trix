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
      return this.pluck('position').toString() === this.pluck('solution').toString();
    };
    return Board;
  })();
  window.Board = Board;
}).call(this);
