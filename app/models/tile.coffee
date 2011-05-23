# 
#  tile.coffee
#  fifteens
#  
#  Created by Andrew Okonetchnikov on 2011-05-23.
#  Copyright 2011 sauspiel.de. All rights reserved.
# 

class Tile extends Backbone.Model
    
    initialize: ->
      if !@get 'empty' 
        @set { empty: false }
    
    isEmpty: ->
      return @get 'empty'
    
    play: ->
      board = @collection
      tilePos = @get 'position'
      emptyPos = board.getEmptyTile().get 'position'
      
      board.getEmptyTile().set { position: tilePos }, { silent: true }
      @set { position: emptyPos }
    
    canBePlayed: ->
      boardSize = @collection.SIZE
      tilePos = @get('position')
      emptyPos = @collection.getEmptyTile().get('position')
      delta = Math.abs(tilePos - emptyPos)
      
      if delta == 1 or delta == boardSize
        # Empty is in first row. Previous tile can not be played
        if emptyPos % boardSize == 0 and tilePos == (emptyPos - 1)
          return false
        # Empty is in last row. Next tile can not be played
        else if (emptyPos + 1) % boardSize == 0 and tilePos == (emptyPos + 1)
          return false
        else
          # If true, return useful data so we can use it in views
          return {
            real: (tilePos - emptyPos),
            delta: delta
          }
      else
        return false

window.Tile = Tile
