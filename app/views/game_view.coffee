# 
#  game_view.coffee
#  fifteens
#  
#  Created by Andrew Okonetchnikov on 2011-05-24.
#  Copyright 2011 sauspiel.de. All rights reserved.
# 

class GameView extends Backbone.View
    
    el: $("#gameview")
    
    events: {
      'click #new_game': 'newGame'
    }
    
    initialize: ->
      _.bindAll this, 'render', 'updateStats'
      
      @model.bind('change:solved', @gameSolved)
      @model.bind('change', @updateStats)
      
      view = new BoardView { model: @model.board }
      @el.append view.render().el
    
    newGame: ->
      @model.newGame() if window.confirm "Are you sure you want to start a new game"
    
    gameSolved: ->
      alert("Congratulations! You solved the puzzle in #{@model.get('moved')} moves.");
    
    updateStats: ->
      @$('#moves_count').html @model.get('moves')

window.GameView = GameView
