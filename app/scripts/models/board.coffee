class window.Board extends Backbone.Collection

    SIZE: 4, # Matrix with SIZE x SIZE elements

    model: Tile,

    initialize: ->
      @resetBoard()

    getTileWithPosition: (position) ->
      @find (tile) -> tile.get('position') is position

    switchTiles: (tile1, tile2) ->
      tile1pos = tile1.get('position')
      tile1.set { position: tile2.get('position') }, { silent: true }
      tile2.set { position: tile1pos }

    resetBoard: ->
      tiles = (for i in [0...@SIZE * @SIZE]
        new @model
          label    : i+1
          position : i
          solution : i
          empty    : (i+1 is @SIZE*@SIZE)
      )
      @reset tiles, silent: true

    shuffle: ->
      positions = @pluck('position').sort -> 0.5 - Math.random()
      tile.set { 'position': positions[idx] } for tile, idx in @models
      @trigger('reset')

    emptyTile: ->
      @find (tile) -> tile.isEmpty()

    emptyTilePosition: ->
      @emptyTile().get 'position'

    isSolved: ->
      @pluck('position').toString() is @pluck('solution').toString()

    setSolved: ->
      game.set 'solved', yes
