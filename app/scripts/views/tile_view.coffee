class window.TileView extends Backbone.View

  WIDTH  : 75
  HEIGHT : 75

  movingTiles: []
  tilesToPlay: []
  el: no
  template: _.template("<div class=\"tile tile_<%= type %>\"></div>")
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
    tileData = @model.toJSON()
    @$el.html @template(tileData)

    @left = (tileData.position % game.board.getSize()) * @WIDTH
    @top = (Math.ceil((tileData.position + 1) / game.board.getSize()) - 1) * @HEIGHT

    @$el
      .css
        'z-index': tileData.position
      .animate
        translate3d: "#{@left}px, #{@top}px, 0"
      ,
        duration: 150
        easing: "ease-out"

    @$el[if @model.get('justAdded') then "addClass" else "removeClass"] "tile_justAdded"
    @

  remove: ->
    @$el.animate
      translate3d: "#{@left}px, #{@top + 150}px, 0"
      opacity: 0
    ,
      complete: =>
        @$el.remove()

  dragTileStart: (e) ->
    @tilesToPlay = @board.getPlayableTilesFor @model
    if @tilesToPlay.length
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
        element: $(tile.view.el)
        transform: _.map $(tile.view.el).css('-webkit-transform').replace('translate3d(','').split(','), (val) -> parseFloat val
      )

  dragTileMove: (e) ->
    if @movingTiles.length
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
    if @movingTiles.length
      if (@horizontal and Math.abs(@deltaX) > @WIDTH/3) or (not @horizontal and Math.abs(@deltaY) > @HEIGHT/3)
        #Play tiles if it passes the half of its size
        @board.movePlayableTiles @tilesToPlay
      else
        # Aniamte tile back to original position
        for tile in @movingTiles
          tileX = tile.transform[0]
          tileY = tile.transform[1]
          $(tile.element).anim({ translate3D: "#{tileX}px, #{tileY}px, 0"}, 0.125, "ease-out")
      @movingTiles = []
