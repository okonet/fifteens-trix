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
      return this.board = new Board();
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
