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
      
      board.getEmptyTile().set({ position: tilePos });
      this.set({ position: emptyPos });
      
      // var tileIndex = board.indexOf(this);
      // var emptyIndex = board.indexOf(board.getEmptyTile());
      
      // var tmpTile = board.at(tileIndex);
      // board.at(tileIndex) = board.getEmptyTile();
      // board.at(emptyIndex) = tmpTile;
      
      if(typeof console !== 'undefined'){console.log(tilePos, emptyPos)};
    },
    
  });
  window.TileView = Backbone.View.extend({
    
    tagName: 'li',
    
    className: 'b-tile',
    
    template: _.template("<p><%= label %></p>"),
    
    events: {
      'click' : 'moveTile'
    },
    
    initialize: function() {
      _.bindAll(this, 'render', 'moveTile');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      tileData = this.model.toJSON();
      $(this.el).html(this.template(tileData));
      if(tileData.empty) $(this.el).addClass('b-tile_empty');
      
      if(typeof console !== 'undefined'){console.log(12312312)};
      
      var board = this.model.collection;
      
      var left = (tileData.position % board.SIZE) * 70;
      var top = (Math.ceil((tileData.position + 1) / board.SIZE) - 1) * 70;
      $(this.el).css({left: left + 'px', top: top + 'px'})
      
      return this;
    },
    
    moveTile: function(){
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
      if(typeof console !== 'undefined'){console.log('Resetting board')};
      
      var tiles = [];
      
      var length = (this.SIZE * this.SIZE);
      for(var i = 0; i < length; i++) {
        tiles.push(new this.model({ label: i+1, position: i }));
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
    
  });
  
  window.BoardView = Backbone.View.extend({
    
    tagName: 'ul',
    
    className: 'b-board',
    
    initialize: function() {
      _.bindAll(this, 'render', 'addTile', 'addTiles');
      this.model.bind('refresh', this.render);
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
    
  });
  
  /*
    Game model and view
  */
  window.Game = Backbone.Model.extend({
    initialize: function(){
      this.board = new Board();
    },
    
    newGame: function(){
      if(typeof console !== 'undefined'){console.log('starting new game')};
      this.board.shuffle();
    },
  });
  
  window.GameView = Backbone.View.extend({
    
    el: $("#gameview"),
    
    events: {
      'click #new_game': 'newGame'
    },
    
    initialize: function() {
      if(typeof console !== 'undefined'){console.log(123)};
      _.bindAll(this, 'render');
      
      var view = new BoardView({model: this.model.board});
      this.el.append(view.render().el);
      
      // Game.bind('refresh', this.newGame);
      
      // Game.newGame();
    },
    
    newGame: function(){
      // if (window.confirm('Are you sure you want to start a new game')) {
        this.model.newGame();
      // }
    },
  });
  
  window.game = new Game;
  window.gameView = new GameView({ model: game });
  
});