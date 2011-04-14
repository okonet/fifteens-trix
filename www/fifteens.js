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
    
    EMPTY: '',
    
    initialize: function(){
      if (!this.get('label')) {
        this.set({'label': this.EMPTY});
      }
    }
    
  });
  window.TileView = Backbone.View.extend({
    
    tagName: 'li',
    
    className: 'b-board_tile',
    
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
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    
    moveTile: function(){
      if(typeof console !== 'undefined'){console.log('Playing tile...')};
      this.model.updatePosition();
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
        tiles.push(new this.model({label: i+1, position: i}));
      }
      
      this.refresh(tiles, {silent: true});
    },
    
    shuffle: function(){
      this.models.sort(function() {return 0.5 - Math.random()});
      this.trigger('refresh');
    }
    
  });
  
  window.BoardView = Backbone.View.extend({
    
    tagName: 'ul',
    
    className: 'b-board',
    
    initialize: function() {
      _.bindAll(this, 'render', 'addTile', 'addTiles');
      this.model.bind('refresh', this.render);
      this.model.bind('change', this.render);
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