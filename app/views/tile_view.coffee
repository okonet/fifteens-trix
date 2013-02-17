class window.TileView extends Backbone.View

  WIDTH: 73,

  HEIGHT: 67,

  tagName: 'div'

  className: 'tile'

  template: _.template("<div class=\"tile__label\"><%= label %></p>")

  events: {
    'click'      : 'play'
    'touchstart' : 'dragTileStart'
    'touchmove'  : 'dragTileMove'
    'touchend'   : 'dragTileEnd'
  }

  # sound: new Audio('sounds/tink.mp3')

  initialize: ->
    _.bindAll @, 'render', 'play', 'dragTileStart', 'dragTileMove', 'dragTileEnd'
    @model.bind('change', @render)
    @model.view = @

  render: ->
    tileData = @model.toJSON()
    $(@el).html @template(tileData)
    $(@el).addClass('tile_empty') if tileData.empty

    left = (tileData.position % game.board.SIZE) * @WIDTH
    top = (Math.ceil((tileData.position + 1) / game.board.SIZE) - 1) * @HEIGHT
    angle = 2 * Math.random() - 1

    $(@el)
      .css({ 'z-index': tileData.position })
      .anim({ translate3d: "#{left}px, #{top}px, 0", rotate: "#{angle}deg" }, 0.025, "ease-out")

    @

  play: ->
    return if not @tilesToPlay = @getTilesToPlay() if not @tilesToPlay

    # Swtich each tile positions
    for i in [@tilesToPlay.length-1...0]
      tile1 = @tilesToPlay[i]
      tile2 = @tilesToPlay[i-1]
      @tilesToPlay[i] = tile2
      @tilesToPlay[i-1] = tile1
      game.board.switchTiles tile1, tile2

    # @sound.play()
    game.set { moves: game.get('moves') + 1 }

  getTilesToPlay: ->
    @positions = @model.getRelativePositioning()
    # Check if the clicked tile is on same column or row with empty tile
    if @positions.delta % @positions.boardSize is 0 # Empty tile and our tile are on a same column
      (game.board.getTileWithPosition pos for pos in [@positions.tilePos..@positions.emptyPos] when (pos - @positions.emptyPos) % @positions.boardSize is 0)
    else if (@positions.delta < @positions.boardSize) and parseInt(@positions.tilePos / @positions.boardSize) is parseInt(@positions.emptyPos / @positions.boardSize) # or they are on the same row
      (game.board.getTileWithPosition pos for pos in [@positions.tilePos..@positions.emptyPos]) if @positions.delta < @positions.boardSize

  dragTileStart: (e) ->
    return if not @tilesToPlay = @getTilesToPlay()

    @touch =
      x1: e.touches[0].pageX
      y1: e.touches[0].pageY
    @horizontal = (@positions.delta < @positions.boardSize)
    @moveDirection = 'right' if @positions.diff < 0 and @horizontal
    @moveDirection = 'left' if @positions.diff > 0 and @horizontal
    @moveDirection = 'down' if @positions.diff < 0 and not @horizontal
    @moveDirection = 'up' if @positions.diff > 0 and not @horizontal

    @movingTiles = (for tile in @tilesToPlay when not tile.isEmpty()
      {
        element: $(tile.view.el)
        transform: _.map $(tile.view.el).css('-webkit-transform').replace('translate3d(','').split(','), (component) -> return parseFloat component
      }
    )

  dragTileMove: (e) ->
    return unless @movingTiles

    @touch.x2 = e.touches[0].pageX
    @touch.y2 = e.touches[0].pageY

    @deltaX = @touch.x2 - @touch.x1
    @deltaY = @touch.y2 - @touch.y1

    # Restrict movement to tile width and height
    switch @moveDirection
      when "left"   then @deltaX = Math.max(Math.min(@deltaX, 0), -@WIDTH)
      when "right"  then @deltaX = Math.min(Math.max(@deltaX, 0), @WIDTH)
      when "up"     then @deltaY = Math.max(Math.min(@deltaY, 0), -@HEIGHT)
      when "down"   then @deltaY = Math.min(Math.max(@deltaY, 0), @HEIGHT)

    # Move each tile only in one direction depending on how tiles are positioned
    for tile in @movingTiles
      tileX = tile.transform[0]
      tileY = tile.transform[1]
      if @horizontal then tileX += @deltaX else tileY += @deltaY
      tile.element.css { '-webkit-transform': "translate3d(#{tileX}px, #{tileY}px, 0)" }

  dragTileEnd: () ->
    return unless @movingTiles

    if (@horizontal and Math.abs(@deltaX) > @WIDTH/8) or (not @horizontal and Math.abs(@deltaY) > @HEIGHT/8)
      @play() #Play the tile if it passes the half of its size
    else
      for tile in @movingTiles
        tileX = tile.transform[0]
        tileY = tile.transform[1]
        $(tile.element).anim({ translate3D: "#{tileX}px, #{tileY}px, 0"}, 0.125, "ease-out") # Aniamte tile back to original position

    @movingTiles = null
