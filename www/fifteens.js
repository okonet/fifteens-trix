// 
//  fifteens.js
//  
//  Created by Andrew Okonetchnikov on 2011-04-10.
//  Copyright 2011 okonet.ru. All rights reserved.
// 

$(function(){
  
  window.Tile = Backbone.Model.extend({
    
    EMPTY: '',
    
    initialize: function(){
      if (!this.get('label')) {
        this.set({'label': this.EMPTY});
      }
    }
    
  });
  
  window.Board = Backbone.Collection.extend({
    
    SIZE: 3, // Matrix with SIZE x SIZE elements
    
    model: Tile,
    
    initialize: function(){
      var length = (this.SIZE * this.SIZE);
      for(var i = 0; i < length; i++) {
        this.add(new this.model({label: i+1, position: i}));
      }
      
      if(typeof console !== 'undefined'){console.log(this.models)};
    },
    
  });
  
  window.Game = new Board;
  
  window.TileView = Backbone.View.extend({
    
    tagName: 'li',
    
    className: 'b-board_item',
    
    template: _.template("<%= label %>"),
    
    events: {
      'click' : 'moveTile'
    },
    
    initialize: function() {
      _.bindAll(this, 'render', 'moveTile');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      if(typeof console !== 'undefined'){console.log('rendering...')};
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    
    moveTile: function(){
      if(typeof console !== 'undefined'){console.log('Playing tile...')};
      this.model.updatePosition();
    },
    
  });
  
  window.GameView = Backbone.View.extend({
    
    el: $("#board"),
    
    initialize: function() {
      if(typeof console !== 'undefined'){console.log(123)};
      _.bindAll(this, 'render');
      
      var view = new TileView({model: Game});
      this.$("#board").append(view.render().el);
      
      // Game.bind('refresh', this.newGame);
      
      // Game.newGame();
    },
  });
  
  window.game = new GameView;
  
});