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
      
      for i in [@SIZE * @SIZE]
        tiles.push new @model { label: i+1, position: i, solution: i }
      
      _.last(tiles).set { empty: true }
      
      @refresh tiles, {silent: true}

    
    shuffle: ->
      positions = @pluck('position').sort ()-> 
        return 0.5 - Math.random()
        
      _.each positions, () =>
        @models[i].set { 'position': pos }
      
      @trigger('refresh')
    
    getEmptyTile: ->
      return @detect (tile) ->
        return tile.isEmpty()
    
    solved: ->
      actual = @pluck 'position'
      solution = @pluck 'solution'
      return actual.toString() == solution.toString()

window.Board = Board