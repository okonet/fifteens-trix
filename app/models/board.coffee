# 
#  board.coffee
#  fifteens
#  
#  Created by Andrew Okonetchnikov on 2011-05-24.
#  Copyright 2011 sauspiel.de. All rights reserved.
# 

class Board extends Backbone.Collection
    
    SIZE: 4, # Matrix with SIZE x SIZE elements
    
    model: Tile,
    
    initialize: ->
      @reset()
    
    reset: ->
      tiles = []
      tiles.push new @model { label: i+1, position: i, solution: i } for i in [0...@SIZE * @SIZE]
      
      _.last(tiles).set { empty: true }
      
      @refresh tiles, {silent: true}

    
    shuffle: ->
      positions = @pluck('position').sort ()-> 
        return 0.5 - Math.random()
        
      _.each positions, (pos, i) =>
        @models[i].set { 'position': pos }
      
      @trigger('refresh')
    
    emptyTile: ->
      return @find (tile) ->
        return tile.isEmpty()
      
    emptyTilePosition: ->
      return @emptyTile().get 'position'
      
    solved: ->
      return @pluck('position').toString() == @pluck('solution').toString()

window.Board = Board