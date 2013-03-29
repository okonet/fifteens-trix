class window.Game extends Backbone.Model

  initialize: ->
    @board = new Board
    @reset()

  newGame: ->
    @board.shuffle()
    @reset()

  isSolved: ->
    @board.pluck('position').toString() is @board.pluck('solution').toString()

  setSolved: ->
    @set 'solved', yes

  reset: ->
    @set
      moves: 0
      solved: false
