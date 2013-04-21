class window.Board extends Backbone.Collection

    TILES_X: 4
    TILES_Y: 8

    model: Tile,

    getTileWithPosition: (position) ->
      @find (tile) -> tile.get('position') is position

    getSize: ->
      @TILES_X

    switchTiles: (tile1, tile2) ->
      tile1pos = tile1.get('position')
      tile1.set 'position', tile2.get('position'), silent: true
      tile2.set 'position', tile1pos

    shuffle: ->
      tiles = []
      for row in [0...@TILES_X]
        row = @TILES_Y - row - 1
        for col in [0...@TILES_X]
          i = row * @TILES_X + col
          tiles.push
            position : i
            type     : row % @TILES_X + 1

      _.last(tiles).type = 0
      positions = _.pluck(tiles, 'position').sort -> 0.5 - Math.random()
      tile.position = positions[idx] for tile, idx in tiles
      @reset tiles

    getEmptyTile: ->
      @find (tile) -> tile.isEmpty()

    getEmptyTilePosition: ->
      @getEmptyTile().get 'position'

    getTilesInRow: (row) ->
      (@getTileWithPosition(row * @TILES_X + i) for i in [0...@TILES_X])

    getEmptyRows: ->
      (row for row in [0...@TILES_Y] when not @getTilesInRow(row)[0]?)

    addRow: ->
      for col in [0...@TILES_X]
        @add
          position: col
          type: Math.ceil(Math.random() * @TILES_X)
          justAdded: yes

    addAndMoveRows: =>
      emptyRows = @getEmptyRows()
      if emptyRows.length
        for row in [_.last(emptyRows)..1]
          @moveRowDown row-1, _.last(emptyRows) - row + 1
        @addRow() # Add new row as a topmost row
      else
        @trigger 'board:isFull'

    moveRowDown: (row, amount = 1) ->
      for tile in @getTilesInRow row when tile?
        tile.set 'position', tile.get('position') + @TILES_X * amount # Move a tile one row down
        tile.set 'justAdded', no # and remove 'justAdded' flag

    destroyTiles: ->
      for row in [0...@TILES_Y]
        tiles = @getTilesInRow row
        types = (tile?.get('type') for tile in tiles)
        firstTile = tiles[0]
        if firstTile?
          len = 1
          for i in [1...tiles.length]
            if tiles[i]?.get('type') is firstTile.get('type') then len++ else break

          if len is @TILES_X
            @remove tile for tile in tiles
            @moveRowDown r for r in [row-1..0]
