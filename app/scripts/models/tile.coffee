class window.Tile extends Backbone.Model

    defaults:
      type: 0

    initialize: ->
      @on 'change', @updateRelativePositions

    getPosition: ->
      @get 'position'

    isEmpty: ->
      @get('type') is 0

    play: ->
      newPos = @collection.getEmptyTilePosition()
      @collection.getEmptyTile().set { position: @getPosition() }, { silent: true }
      @set position, newPos

    updateRelativePositions: ->
      @set 'diff', @getPosition() - @collection.getEmptyTilePosition(), silent: yes
      @set 'delta', Math.abs @get('diff'), silent: yes

    canBePlayed: ->
      boardSize = @collection.getSize()
      tilePos = @getPosition()
      emptyPos = @collection.getEmptyTilePosition()
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
