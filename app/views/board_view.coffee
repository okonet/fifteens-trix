# 
#  board_view.coffee
#  fifteens
#  
#  Created by Andrew Okonetchnikov on 2011-05-24.
#  Copyright 2011 sauspiel.de. All rights reserved.
# 

class BoardView extends Backbone.View
    
    tagName: 'ul'
    
    className: 'b-board'
    
    initialize: ->
      _.bindAll this, 'render', 'addTile', 'addTiles'
      @model.bind('refresh', @render)
      @model.bind('change', @checkSolved)
      @model.view = @
      @model.shuffle()

    render: ->
      $(@el).html('')
      @addTiles()
      return @
    
    addTile: (tile) ->
      view = new TileView {model: tile}
      $(@el).append view.render().el
    
    addTiles: ->
      @model.each @addTile
    
    checkSolved: ->
      game.set { solved: true } if @solved()
  
window.BoardView = BoardView