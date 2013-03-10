class window.Board extends Backbone.Collection

    TILES_X: 4
    TILES_Y: 6

    model: Tile,

    initialize: ->
      @resetBoard()

    getTileWithPosition: (position) ->
      @find (tile) -> tile.get('position') is position

    getSize: ->
      @TILES_X

    switchTiles: (tile1, tile2) ->
      tile1pos = tile1.get('position')
      tile1.set { position: tile2.get('position') }, { silent: true }
      tile2.set { position: tile1pos }

    resetBoard: ->
      row = 0
      tiles = (for i in [0...@TILES_X * @TILES_Y]
        row += 1 if i % @TILES_X is 0 and row < 4
        new @model
          label    : i+1
          position : i
          solution : i
          type     : row
          empty    : (i+1 is @TILES_X*@TILES_Y)
      )
      @add tiles

    shuffle: ->
      positions = @pluck('position').sort -> 0.5 - Math.random()
      tile.set 'position', positions[idx], { silent: yes } for tile, idx in @models
      @trigger('reset')

    emptyTile: ->
      @find (tile) -> tile.isEmpty()

    emptyTilePosition: ->
      @emptyTile().get 'position'

    isSolved: ->
      @pluck('position').toString() is @pluck('solution').toString()

    setSolved: ->
      game.set 'solved', yes

    getTilesInRow: (row) ->
      (@getTileWithPosition(row * @TILES_X + i) for i in [0...@TILES_X])

    getTilesToDestroy: =>
      for row in [0...@TILES_Y]
        tiles = @getTilesInRow row
        firstTile = tiles[0]
        len = 1
        for i in [1...tiles.length]
          if tiles[i]?.get('type') is firstTile?.get('type')
            len++
          else break
        if len is @TILES_X then tiles else []
