class window.BoardView extends Backbone.View

    el: $('.board__tiles')

    initialize: ->
      @listenTo @collection, 'reset', @render
      @collection.view = @
      @collection.shuffle()

    render: =>
      els = []
      @$el.html('')
      @collection.each (tile) ->
        view = new TileView( model: tile )
        els.push view.render().el
      @$el.append els
      return @
