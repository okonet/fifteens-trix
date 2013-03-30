class window.Game extends Backbone.Model

  initialize: ->
    @board = new Board
    @newGame()

  newGame: ->
    @board.shuffle()
    @reset()

  reset: ->
    @set
      moves: 0
      isOver: false
