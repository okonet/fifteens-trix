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
    @startTicking()

  togglePause: ->
    @set 'isPaused', not @get('isPaused')
    if @get('isPaused') then @stopTicking() else @startTicking()

  startTicking: ->
    @timer = setInterval @tick, 5000

  stopTicking: ->
    if @timer?
      clearInterval @timer
      @timer = null

  tick: =>
    @board.addAndMoveRows()

  reset: ->
    @stopTicking()
    @set
      moves: 0
      isOver: false
