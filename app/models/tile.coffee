# 
#  tile.coffee
#  fifteens
#  
#  Created by Andrew Okonetchnikov on 2011-05-23.
#  Copyright 2011 sauspiel.de. All rights reserved.
# 

class Tile extends Backbone.Model
    
    initialize: ->
      @set { empty: false } if !@get 'empty' 
        
    position: ->
      @get 'position'
    
    isEmpty: ->
      return @get 'empty'
    
    play: ->
      newPos = @collection.emptyTilePosition()
      @collection.emptyTile().set { position: @position() }, { silent: true }
      @set { position: newPos }
    
    getRelativePositioning: ->
      boardSize = @collection.SIZE
      tilePos = @position()
      emptyPos = @collection.emptyTilePosition()
      diff = tilePos - emptyPos
      delta = Math.abs diff
      
      {
        boardSize:  boardSize
        tilePos:    tilePos
        emptyPos:   emptyPos
        diff:       diff
        delta:      delta
      }

window.Tile = Tile
