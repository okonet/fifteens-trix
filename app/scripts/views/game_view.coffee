class window.GameView extends Backbone.View

    el: $("body")

    events:
      'click .game-controls__btn-new'  : 'newGame'
      'click .game-controls__btn-pause': 'togglePause'

    initialize: ->
      @listenTo @model, 'change:isOver', @gameOver
      @listenTo @model, 'change:isPaused', @gamePaused
      @listenTo @model, 'change', @updateStats
      @listenTo @model, 'change:moves', =>
        @model.board.destroyTiles()

      view = new BoardView( collection: @model.board )
      view.render()

      window.addEventListener 'shake', @newGameConfirmation, false # Ask to start new game on shake
      _.defer -> window.scrollTo(false, 0) # Hide URL bar on iOS

    newGame: =>
      @model.newGame()
      $('.game-view').removeClass('game-view_result')

    togglePause: =>
      @model.togglePause()

    newGameConfirmation: =>
      @newGame() if window.confirm "Are you sure you want start a new game?"

    gameOver: =>
      $('.game-view').addClass('game-view_result')
      $('.game-result').html("Game over!<br><br>Tap to start over...")
      @$el.one "click", @newGame

    gamePaused: =>
      if @model.get('isPaused')
        $('.game-view').addClass('game-view_paused')
        $('.game-result').html("Game paused...<br><br>Tap to continue...")
        @$el.one "click", @togglePause
      else
        $('.game-view').removeClass('game-view_paused')
        @$el.off "click", @togglePause

    updateStats: =>
      @$('#moves_count').html @model.get('moves')
      @$('.game-controls__btn-pause').val(if @model.get('isPaused') then "Paused" else "Pause")
