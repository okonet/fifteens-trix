#
#  board_view.coffee
#  fifteens
#
#  Created by Andrew Okonetchnikov on 2011-05-24.
#  Copyright 2011 sauspiel.de. All rights reserved.
#

class BoardView extends Backbone.View

    # tagName: 'div'

    el: $('.b-board__tiles')

    initialize: ->
      _.bindAll this, 'render', 'addTile', 'addTiles', 'checkSolved'
      @model.bind('refresh', @render)
      @model.bind('change', @checkSolved)
      @model.view = @
      @model.shuffle()

    render: ->
      $(@el).html('')
      @addTiles()
      return @

    addTile: (tile) ->
      view = new TileView {model: tile}
      @el.append view.render().el

    addTiles: ->
      @model.each @addTile

    checkSolved: ->
      game.set { solved: true } if @model.solved()

window.BoardView = BoardView
