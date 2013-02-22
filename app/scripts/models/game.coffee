class window.Game extends Backbone.Model

  initialize: ->
    @board = new Board()
    @reset()

  newGame: ->
    @board.shuffle()
    @reset()

  reset: ->
    @set
      moves: 0
      solved: false
