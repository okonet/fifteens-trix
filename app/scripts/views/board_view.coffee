class window.BoardView extends Backbone.View

    el: $('.board__tiles')

    initialize: ->
      @listenTo @model, 'reset', @render
      @listenTo @model, 'change', @checkSolved
      @model.view = @
      @model.shuffle()

    render: =>
      @$el.html('')
      @addTiles()
      return @

    addTile: (tile) =>
      view = new TileView( model: tile )
      @$el.append view.render().el

    addTiles: =>
      @model.each @addTile

    checkSolved: =>
      @model.setSolved() if @model.isSolved()
