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
  
  sound: new Audio('sounds/tink.mp3')
  
  initialize: ->
    _.bindAll @, 'render', 'playTile', 'dragTileStart', 'dragTileMove', 'dragTileEnd'
    @model.bind('change', @render)
    @model.view = @

  render: ->
    board = @model.collection
    tileData = @model.toJSON()
    $(@el).html @template(tileData)
    $(@el).addClass('b-tile_empty') if tileData.empty
    
    left = (tileData.position % board.SIZE) * @WIDTH
    top = (Math.ceil((tileData.position + 1) / board.SIZE) - 1) * @HEIGHT
    
    $(@el).css({ 'z-index': tileData.position }).anim({ translate3d: "#{left}px, #{top}px, 0"}, 0.125, "ease-out")
    
    return @
  
  play: ->
    if @model.canBePlayed()
      @model.play()
      @sound.play()
  
  dragTileStart: (e) ->
    @touch = {}
    @touch.x1 = e.touches[0].pageX
    @touch.y1 = e.touches[0].pageY
    
    canBePlayed = @model.canBePlayed()
    
    if canBePlayed
      @playing = true
      @horizontal = (canBePlayed.delta == 1)
      
      @moveTo = if (@horizontal and canBePlayed.real < 0) then 'right' else
                if @horizontal and canBePlayed.real > 0  then 'left' else
                if not @horizontal and canBePlayed.real < 0 then 'bottom' else
                if not @horizontal and canBePlayed.real > 0 then 'top' else false
      
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
    visibleX = @originalTransform[0]
    visibleY = @originalTransform[1]
    
    # Restrict movement to tile width and height
    switch @moveTo
      when "left"   then @deltaX = Math.max(Math.min(@deltaX, 0), -@WIDTH)
      when "right"  then @deltaX = Math.min(Math.max(@deltaX, 0), @WIDTH)
      when "top"    then @deltaY = Math.max(Math.min(@deltaY, 0), -@HEIGHT)
      when "bottom" then @deltaY = Math.min(Math.max(@deltaY, 0), @HEIGHT)

    
    # Move only in one direction depending on how tiles are positioned
    if @horizontal
      visibleX += @deltaX
    else
      visibleY += @deltaY
    
    $(@el).css { '-webkit-transform': "translate3d(#{visibleX}px, #{visibleY}px, 0)" }
  
  dragTileEnd: () ->
    return false unless @playing
    
    if Math.abs(@deltaX) > @WIDTH/2 or Math.abs(@deltaY) > @HEIGHT/2
      @play() #Play the tile if it passes the half of its size
    else
      $(@el).anim({ translate3D: "#{@originalTransform[0]}px, #{@originalTransform[1]}px, 0"}, 0.125, "ease-out") # Revert it back to original position
    
    @playing = false
    @originalTransform = []

window.TileView = TileView
  
