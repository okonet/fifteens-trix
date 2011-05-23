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
