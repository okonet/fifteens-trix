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
    Tile.prototype.isEmpty = function() {
      return this.get('empty');
    };
    Tile.prototype.play = function() {
      var board, emptyPos, tilePos;
      board = this.collection;
      tilePos = this.get('position');
      emptyPos = board.getEmptyTile().get('position');
      board.getEmptyTile().set({
        position: tilePos
      }, {
        silent: true
      });
      this.set({
        position: emptyPos
      });
      return game.set({
        moves: game.get('moves') + 1
      });
    };
    Tile.prototype.canBePlayed = function() {
      var boardSize, delta, emptyPos, tilePos;
      boardSize = this.collection.SIZE;
      tilePos = this.get('position');
      emptyPos = this.collection.getEmptyTile().get('position');
      delta = Math.abs(tilePos - emptyPos);
      if (delta === 1 || delta === boardSize) {
        if (emptyPos % boardSize === 0 && tilePos === (emptyPos - 1)) {
          return false;
        } else if ((emptyPos + 1) % boardSize === 0 && tilePos === (emptyPos + 1)) {
          return false;
        } else {
          return {
            real: tilePos - emptyPos,
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
