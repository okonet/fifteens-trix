class window.TileView extends Backbone.View

  WIDTH  : 60
  HEIGHT : 60

  movingTiles: []
  tilesToPlay: []
  className: "tile"

  events:
    'touchstart' : 'dragTileStart'
    'touchmove'  : 'dragTileMove'
    'touchend'   : 'dragTileEnd'

  initialize: ->
    @listenTo @model, 'change', @render
    @listenTo @model, 'remove', @remove
    @board = @model.collection
    @model.view = @

  render: =>
    data = @model.toJSON()
    @$el.attr "class", "tile tile_#{@model.get('type')}"
    @left = (data.position % game.board.getSize()) * @WIDTH
    @top = (Math.ceil((data.position + 1) / game.board.getSize()) - 1) * @HEIGHT

    @$el
      .css
        'z-index'   : data.position
        'transform' : "translate3d(#{@left}px, #{@top}px, 0)"

    @$el[if @model.get('justAdded') then "addClass" else "removeClass"] "tile_justAdded"
    @

  remove: ->
    @$el.addClass('tile_removing').css 'transform', "translate3d(#{@left}px, #{@top + 150}px, 0)"

    _.delay =>
      @$el.remove()
    , 500

  dragTileStart: (evt) ->
    @tilesToPlay = @board.getPlayableTilesFor @model
    if @tilesToPlay.length
      e = evt.originalEvent
      @model.updateRelativePositions()
      delta = @model.get('delta')
      diff = @model.get('diff')
      @touch =
        x1: e.touches[0].pageX
        y1: e.touches[0].pageY
      @horizontal = (delta < @board.getSize())
      @moveDirection = 'right' if diff < 0 and @horizontal
      @moveDirection = 'left' if diff > 0 and @horizontal
      @moveDirection = 'down' if diff < 0 and not @horizontal
      @moveDirection = 'up' if diff > 0 and not @horizontal
      @movingTiles = (for tile in @tilesToPlay when not tile.isEmpty()
        tile.matrix = tile.view.$el.addClass('tile_dragging').css('transform')
        tile
      )

  dragTileMove: (evt) ->
    if @movingTiles.length
      e = evt.originalEvent
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
        tileX = 0
        tileY = 0
        if @horizontal then tileX += @deltaX else tileY += @deltaY
        tile.view.$el.css 'transform': "#{tile.matrix} translate3d(#{tileX}px, #{tileY}px, 0)"

  dragTileEnd: ->
    if @movingTiles.length
      tile.view.$el.removeClass('tile_dragging') for tile in @movingTiles
      if (@horizontal and Math.abs(@deltaX) > @WIDTH/3) or (not @horizontal and Math.abs(@deltaY) > @HEIGHT/3)
        #Play tiles if it passes the half of its size
        @board.movePlayableTiles @tilesToPlay
      else
        # Aniamte tile back to original position
        tile.view.$el.css 'transform', tile.matrix for tile in @movingTiles
      @movingTiles = []
