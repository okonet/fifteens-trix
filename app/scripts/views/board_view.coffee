class window.BoardView extends Backbone.View

    el: $('.board__tiles')

    initialize: ->
      @listenTo @collection, 'reset', @render
      @collection.view = @
      @collection.shuffle()

    render: =>
      @$el.html('')
      @addTiles()
      return @

    addTile: (tile) =>
      view = new TileView( model: tile )
      @$el.append view.render().el

    addTiles: =>
      @collection.each @addTile
