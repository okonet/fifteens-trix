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
      var i, tiles, _i, _len, _ref;
      tiles = [];
      _ref = [this.SIZE * this.SIZE];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
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
      _.each(positions, __bind(function() {
        return this.models[i].set({
          'position': pos
        });
      }, this));
      return this.trigger('refresh');
    };
    Board.prototype.getEmptyTile = function() {
      return this.detect(function(tile) {
        return tile.isEmpty();
      });
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
