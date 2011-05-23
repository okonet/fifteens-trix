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
