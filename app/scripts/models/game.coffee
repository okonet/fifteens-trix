class window.Game extends Backbone.Model

  initialize: ->
    @board = new Board
    @listenTo @board, "board:isFull", =>
      @stopTicking()
      @set 'isOver', yes
    @newGame()

  newGame: ->
    @reset()
    @board.shuffle()
    @timer = setInterval @tick, 5000

  tick: =>
    @board.addAndMoveRows()

  stopTicking: ->
    if @timer?
      clearInterval @timer
      @timer = null

  reset: ->
    @stopTicking()
    @set
      moves: 0
      isOver: false
