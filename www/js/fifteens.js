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
      
      board.getEmptyTile().set({ position: tilePos }, { silent: true });
      this.set({ position: emptyPos });
      game.set({ moves: game.get('moves') + 1 });
    },
    
    canBePlayed: function(){
      var boardSize = this.collection.SIZE;
      var tilePos = this.get('position');
      var emptyPos = this.collection.getEmptyTile().get('position');
      var delta = Math.abs(tilePos - emptyPos);
      
      if(delta == 1 || delta == boardSize) {
        // Empty is in first row. Previous tile can not be played
        if(emptyPos % boardSize == 0 && tilePos == (emptyPos - 1))
          return false;
        // Empty is in last row. Next tile can not be played
        else if((emptyPos + 1) % boardSize == 0 && tilePos == (emptyPos + 1))
          return false;
        else
          return delta; // If true, return delta so we can know in which direction to play
      } else {
        return false;
      }
    },

  });
  window.TileView = Backbone.View.extend({
    
    WIDTH: 144,
    HEIGHT: 136,
    
    tagName: 'li',
    
    className: 'b-tile',
    
    template: _.template("<p><%= label %></p>"),
    
    events: {
      // 'tap'            : 'playTile',
      // 'swipe'          : 'playTile',
      'touchablestart' : 'dragTileStart',
      'touchablemove'  : 'dragTileMove',
      'touchableend'   : 'dragTileEnd'
    },
    
    initialize: function() {
      _.bindAll(this, 'render', 'playTile', 'dragTileStart', 'dragTileMove', 'dragTileEnd');
      this.model.bind('change', this.render);
      this.model.view = this;
      $(this.el).Touchable();
    },

    render: function() {
      tileData = this.model.toJSON();
      $(this.el).html(this.template(tileData));
      
      if(tileData.empty) $(this.el).addClass('b-tile_empty');
      
      var board = this.model.collection;
      
      var left = (tileData.position % board.SIZE) * this.WIDTH;
      var top = (Math.ceil((tileData.position + 1) / board.SIZE) - 1) * this.HEIGHT;
      
      var el = $(this.el);
      
      el.css({ 'z-index': tileData.position }).anim({ translate: left + 'px, ' + top + 'px'}, 0.125, 'ease-out');
      
      return this;
    },
    
    playTile: function(){
      if(this.model.canBePlayed()) this.model.play();
    },
    
    dragTileStart: function(event){
      touch = event.data;
      
      var canBePlayed = this.model.canBePlayed();
      
      if(canBePlayed) {
        this.playing = true;
        this.horizontal = (canBePlayed == 1) ? true : false;
        this.originalTransform = _.map($(this.el).css('-webkit-transform').replace('translate(','').split(','), function(component){
          return parseFloat(component);
        });
      }
    },
    
    dragTileMove: function(event){
      if(!this.playing) return false;
      
      touch = event.data;
      
      this.deltaX = touch.currentTouch.x - touch.startTouch.x;
      this.deltaY = touch.currentTouch.y - touch.startTouch.y;
      
      var visibleX = this.originalTransform[0];
      var visibleY = this.originalTransform[1];
      
      if(this.horizontal) {
        visibleX += this.deltaX;
      } else {
        visibleY += this.deltaY;
      }
      
      $(this.el).css({ '-webkit-transform': 'translate(' + visibleX + 'px, ' + visibleY + 'px)'});
    },
    
    dragTileEnd: function(event){
      if(!this.playing) return false;
      
      touch = event.data;
      
      if(Math.abs(this.deltaX) > this.WIDTH/2 || Math.abs(this.deltaY) > this.HEIGHT/2) {
        // Play the tile if it passes the half of its size
        this.model.play();
      } else {
        // Revert it back to original position
        $(this.el).anim({ translate: this.originalTransform[0] + 'px, ' + this.originalTransform[1] + 'px'}, 0.125, 'ease-out');
      }
      
      this.playing = false;
      this.originalTransform = [];
    },
    
  });
  
  /*
    Board consist of tiles
  */
  window.Board = Backbone.Collection.extend({
    
    SIZE: 4, // Matrix with SIZE x SIZE elements
    
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
      this.set({ moves: 0 });
    },
    
    newGame: function(){
      this.board.shuffle();
      this.set({ moves: 0 });
    },
  });
  
  window.GameView = Backbone.View.extend({
    
    el: $("#gameview"),
    
    events: {
      'click #new_game': 'newGame'
    },
    
    initialize: function() {
      _.bindAll(this, 'render', 'updateStats');
      
      this.model.bind('change:solved', this.gameSolved);
      this.model.bind('change', this.updateStats);
      
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
    
    updateStats: function(){
      this.$('#moves_count').html(this.model.get('moves'));
    }
  });
  
  window.game = new Game;
  window.gameView = new GameView({ model: game });
  
});