class window.Board extends Backbone.Collection

    cols: 5
    rows: 8
    model: Tile

    switchTiles: (tile1, tile2) ->
      tile1pos = tile1.get('position')
      tile1.set 'position', tile2.get('position'), silent: true
      tile2.set 'position', tile1pos

    shuffle: ->
      @reset()
      startRow = @rows - @cols
      for row in [startRow...@rows]
        for col in [0...@cols]
          i = row * @cols + col
          @add new Tile
            position : i
            type     : row % @cols + 1

      @last().set 'type', 0
      positions = [startRow * @cols...@cols * @rows].sort -> 0.5 - Math.random()
      @each (tile, idx) ->
        tile.set 'position', positions[idx]

    getSize: ->
      @cols

    getTileWithPosition: (pos) ->
      @find (tile) -> tile.get('position') is pos

    getEmptyTile: ->
      @find (tile) -> tile.isEmpty()

    getEmptyTilePosition: ->
      @getEmptyTile().get 'position'

    getTilesInRow: (row) ->
      (@getTileWithPosition(row * @cols + i) for i in [0...@cols])

    getEmptyRows: ->
      (row for row in [0...@rows] when not @getTilesInRow(row)[0]?)

    getPlayableTilesFor: (tile) ->
      tiles    = []
      tilePos  = tile.getPosition()
      emptyPos = @getEmptyTilePosition()
      diff     = tilePos - emptyPos
      delta    = Math.abs diff

      if delta % @cols is 0 # Empty tile and our tile are on a same column
        for pos in [tilePos..emptyPos] when (pos - emptyPos) % @cols is 0
          tiles.push @getTileWithPosition(pos)
      else if (delta < @cols) and parseInt(tilePos / @cols) is parseInt(emptyPos / @cols) # or they are on the same row
        for pos in [tilePos..emptyPos]
          tiles.push @getTileWithPosition(pos)
      tiles

    movePlayableTiles: (tiles) ->
      if tiles.length
        # Swtich positions for each tile pair
        for i in [tiles.length-1...0]
          tile1 = tiles[i]
          tile2 = tiles[i-1]
          tiles[i] = tile2
          tiles[i-1] = tile1
          @switchTiles tile1, tile2

        game.set('moves', game.get('moves') + 1)

    addRow: ->
      for col in [0...@cols]
        @add
          position: col
          type: Math.ceil(Math.random() * @cols)
          justAdded: yes

    addAndMoveRows: =>
      emptyRows = @getEmptyRows()
      if emptyRows.length
        for row in [_.last(emptyRows)..1]
          @moveRowDown row-1, _.last(emptyRows) - row + 1
        @addRow() # Add new row as a topmost row
      else
        @moveRowDown 0, 0
        @trigger 'board:isFull'

    moveRowDown: (row, amount = 1) ->
      for tile in @getTilesInRow row when tile?
        tile.set 'position', tile.get('position') + @cols * amount # Move a tile one row down
        tile.set 'justAdded', no # and remove 'justAdded' flag

    destroyTiles: ->
      for row in [0...@rows]
        tiles = @getTilesInRow row
        types = (tile?.get('type') for tile in tiles)
        firstTile = tiles[0]
        if firstTile?
          len = 1
          for i in [1...tiles.length]
            if tiles[i]?.get('type') is firstTile.get('type') then len++ else break

          if len is @cols
            @remove tile for tile in tiles
            @moveRowDown r for r in [row-1..0]
