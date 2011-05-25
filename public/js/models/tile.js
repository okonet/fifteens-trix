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
