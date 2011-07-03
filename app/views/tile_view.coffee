# 
#  tile_view.coffee
#  fifteens
#  
#  Created by Andrew Okonetchnikov on 2011-05-23.
#  Copyright 2011 sauspiel.de. All rights reserved.
# 

class TileView extends Backbone.View
  
  WIDTH: 144,

  HEIGHT: 136,

  tagName: 'li'

  className: 'b-tile'

  template: _.template("<p><%= label %></p>")

  events: {
    'click'      : 'play',
    'tap'        : 'play',
    'touchstart' : 'dragTileStart',
    'touchmove'  : 'dragTileMove',
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
    $(@el).addClass('b-tile_empty') if tileData.empty
    
    left = (tileData.position % game.board.SIZE) * @WIDTH
    top = (Math.ceil((tileData.position + 1) / game.board.SIZE) - 1) * @HEIGHT
    
    $(@el).css({ 'z-index': tileData.position }).anim({ translate3d: "#{left}px, #{top}px, 0"}, 0.125, "ease-out")
    
    @
  
  play: ->
    
    @positions = @model.getRelativePositioning()
    
    if @positions.delta < @positions.boardSize or @positions.delta % @positions.boardSize == 0 
      @playing = true
      
      @horizontal = (@positions.delta < @positions.boardSize)
      @moveDirection = 'right' if @positions.diff < 0 and @horizontal
      @moveDirection = 'left' if @positions.diff > 0 and @horizontal
      @moveDirection = 'down' if @positions.diff < 0 and not @horizontal
      @moveDirection = 'up' if @positions.diff > 0 and not @horizontal
      
      # Find tiles between empty and clicked tile
      if @positions.delta % @positions.boardSize == 0 # Empty and tile in a same column
        @tilesToPlay = (game.board.getTileWithPosition pos for pos in [@positions.tilePos..@positions.emptyPos] when (pos - @positions.emptyPos) % @positions.boardSize == 0)
      else # or they are on the same row
        @tilesToPlay = (game.board.getTileWithPosition pos for pos in [@positions.tilePos..@positions.emptyPos]) if @positions.delta < @positions.boardSize
      
      # Swtich each tile positions
      for i in [@tilesToPlay.length-1...0]
        tile1 = @tilesToPlay[i]
        tile2 = @tilesToPlay[i-1]
        @tilesToPlay[i] = tile2
        @tilesToPlay[i-1] = tile1
        game.board.switchTiles tile1, tile2
      
      # @sound.play()
      game.set { moves: game.get('moves') + 1 }
  
  dragTileStart: (e) ->
    @touch = {}
    @touch.x1 = e.touches[0].pageX
    @touch.y1 = e.touches[0].pageY    
      
    @originalTransform = _.map($(@el).css('-webkit-transform').replace('translate3d(','').split(','), (component) ->
      return parseFloat(component)
    )
  
  dragTileMove: (e) ->
    return false unless @playing
    
    @touch.x2 = e.touches[0].pageX
    @touch.y2 = e.touches[0].pageY
    
    @deltaX = @touch.x2 - @touch.x1
    @deltaY = @touch.y2 - @touch.y1
    
    # Respect current tile positioning
    tileX = @originalTransform[0]
    tileY = @originalTransform[1]
    
    # Restrict movement to tile width and height
    switch @moveDirection
      when "left"   then @deltaX = Math.max(Math.min(@deltaX, 0), -@WIDTH)
      when "right"  then @deltaX = Math.min(Math.max(@deltaX, 0), @WIDTH)
      when "up"     then @deltaY = Math.max(Math.min(@deltaY, 0), -@HEIGHT)
      when "down"   then @deltaY = Math.min(Math.max(@deltaY, 0), @HEIGHT)

    # Move only in one direction depending on how tiles are positioned
    if @horizontal
      tileX += @deltaX
    else
      tileY += @deltaY
    
    $(@el).css { '-webkit-transform': "translate3d(#{tileX}px, #{tileY}px, 0)" }
  
  dragTileEnd: () ->
    return false unless @playing
    
    if (@horizontal and Math.abs(@deltaX) > @WIDTH/8) or not (@horizontal and Math.abs(@deltaY) > @HEIGHT/8)
      @play() #Play the tile if it passes the half of its size
    else
      $(@el).anim({ translate3D: "#{@originalTransform[0]}px, #{@originalTransform[1]}px, 0"}, 0.125, "ease-out") # Revert it back to original position
    
    @playing = false
    @originalTransform = []

window.TileView = TileView
  
