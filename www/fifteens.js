// 
//  fifteens.js
//  
//  Created by Andrew Okonetchnikov on 2011-04-10.
//  Copyright 2011 okonet.ru. All rights reserved.
// 

$(function(){
  
  /*
    Tile model and view
  */
  window.Tile = Backbone.Model.extend({
    
    initialize: function(){
      if (!this.get('empty')) {
        this.set({ empty: false });
      }  
    },
    
    isEmpty: function(){
      return this.get('empty');
    },
    
    play: function(){
      var board = this.collection;
      var tilePos = this.get('position');
      var emptyPos = board.getEmptyTile().get('position');
      
      if(this.canPlay(tilePos, emptyPos)) {
        board.getEmptyTile().set({ position: tilePos }, { silent: true });
        this.set({ position: emptyPos });
      }
    },
    
    canPlay: function(tilePos, emptyPos){
      var boardSize = this.collection.SIZE;
      var delta = Math.abs(tilePos - emptyPos);
      
      if(delta == 1 || delta == boardSize) {
        // Empty is in first row. Previous tile can not be played
        if(emptyPos % boardSize == 0 && tilePos == (emptyPos - 1))
          return false;
        // Empty is in last row. Next tile can not be played
        else if((emptyPos + 1) % boardSize == 0 && tilePos == (emptyPos + 1))
          return false;
        else
          return true;
      } else {
        return false;
      }
    },

  });
  window.TileView = Backbone.View.extend({
    
    tagName: 'li',
    
    className: 'b-tile',
    
    template: _.template("<p><%= label %></p>"),
    
    events: {
      'tap' : 'playTile',
      'swipe' : 'playTile',
      // 'click' : 'playTile',
    },
    
    initialize: function() {
      _.bindAll(this, 'render', 'playTile');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      tileData = this.model.toJSON();
      $(this.el).html(this.template(tileData));
      if(tileData.empty) $(this.el).addClass('b-tile_empty');
      
      var board = this.model.collection;
      
      var top = (tileData.position % board.SIZE) * 70;
      var left = (Math.ceil((tileData.position + 1) / board.SIZE) - 1) * 70;
      
      $(this.el).anim({ translate: top + 'px, ' + left + 'px'}, 0.25, 'ease-out', 
      function(){
        $(this.el).css({left: left + 'px', top: top + 'px', translate: '0,0'})
      });
      
      return this;
    },
    
    playTile: function(){
      this.model.play();
    },
    
  });
  
  /*
    Board consist of tiles
  */
  window.Board = Backbone.Collection.extend({
    
    SIZE: 3, // Matrix with SIZE x SIZE elements
    
    model: Tile,
    
    initialize: function(){
      this.reset();
    },
    
    reset: function(){
      var tiles = [];
      
      var length = (this.SIZE * this.SIZE);
      for(var i = 0; i < length; i++) {
        tiles.push(new this.model({ label: i+1, position: i, solution: i }));
      }
      
      _.last(tiles).set({ empty: true });
      
      this.refresh(tiles, {silent: true});
    },
    
    shuffle: function(){
      var positions = this.pluck('position').sort(function() {return 0.5 - Math.random()});
      _.each(positions, _.bind(function(pos, i){ this.models[i].set({ 'position': pos }); }, this));
      this.trigger('refresh');
    },
    
    getEmptyTile: function(){
      return this.detect(function(tile){ return tile.isEmpty() });
    },
    
    solved: function(){
      var actual = this.pluck('position');
      var solution = this.pluck('solution');
      return actual.toString() === solution.toString();
    },
    
  });
  
  window.BoardView = Backbone.View.extend({
    
    tagName: 'ul',
    
    className: 'b-board',
    
    initialize: function() {
      _.bindAll(this, 'render', 'addTile', 'addTiles');
      this.model.bind('refresh', this.render);
      this.model.bind('change', this.checkSolved);
      this.model.view = this;
      this.model.shuffle();
    },

    render: function() {
      $(this.el).html('');
      this.addTiles();
      return this;
    },
    
    addTile: function(tile){
      var view = new TileView({model: tile});
      $(this.el).append(view.render().el);
    },
    
    addTiles: function() {
      this.model.each(this.addTile);
    },
    
    checkSolved: function(){
      if(this.solved()) game.set({ solved: true });
    },
    
  });
  
  /*
    Game model and view
  */
  window.Game = Backbone.Model.extend({
    initialize: function(){
      this.board = new Board();
    },
    
    newGame: function(){
      this.board.shuffle();
    },
  });
  
  window.GameView = Backbone.View.extend({
    
    el: $("#gameview"),
    
    events: {
      'click #new_game': 'newGame'
    },
    
    initialize: function() {
      _.bindAll(this, 'render');
      
      this.model.bind('change:solved', this.gameSolved);
      
      var view = new BoardView({model: this.model.board});
      this.el.append(view.render().el);
    },
    
    newGame: function(){
      if (window.confirm('Are you sure you want to start a new game')) {
        this.model.newGame();
      }
    },
    
    gameSolved: function(){
      alert('Congratulations!!!');
    },
  });
  
  window.game = new Game;
  window.gameView = new GameView({ model: game });
  
});