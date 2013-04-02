class window.BoardView extends Backbone.View

    el: $('.board__tiles')

    initialize: ->
      @listenTo @collection, 'reset', @render
      @listenTo @collection, 'add', @addOne
      @collection.shuffle()
      @collection.view = @

    addOne: (tile) ->
      view = new TileView( model: tile )
      @$el.append view.render().el

    render: =>
      $.fx.off = yes
      els = []
      @$el.html('')
      @collection.each (tile) ->
        view = new TileView( model: tile )
        els.push view.render().el
      @$el.append els
      _.delay ->
        $.fx.off = no
      , 250
      @
