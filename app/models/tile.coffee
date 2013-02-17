#
#  tile.coffee
#  fifteens
#
#  Created by Andrew Okonetchnikov on 2011-05-23.
#  Copyright 2011 sauspiel.de. All rights reserved.
#

class Tile extends Backbone.Model

    initialize: ->
      @set { empty: false } unless @get 'empty'

    getPosition: ->
      @get 'position'

    isEmpty: ->
      @get('empty') is yes

    play: ->
      newPos = @collection.emptyTilePosition()
      @collection.emptyTile().set { position: @getPosition() }, { silent: true }
      @set { position: newPos }

    canBePlayed: ->
      boardSize = @collection.SIZE
      tilePos = @getPosition()
      emptyPos = @collection.emptyTilePosition()
      delta = Math.abs(@getPosition() - emptyPos)

      if delta is 1 or delta is boardSize
        # Empty is in first row. Previous tile can not be played
        if emptyPos % boardSize is 0 and @getPosition() is (emptyPos - 1) then no
        # Empty is in last row. Next tile can not be played
        else if (emptyPos + 1) % boardSize is 0 and @getPosition() is (emptyPos + 1) then no
        else
          # If true, return useful data so we can use it in views
          real  : (@getPosition - emptyPos)
          delta : delta
      else
        no

    getRelativePositioning: ->
      boardSize = @collection.SIZE
      tilePos = @getPosition()
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
