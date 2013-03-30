class window.GameView extends Backbone.View

    el: $("body")

    events:
      'click #new_game': 'newGame'

    initialize: ->
      @listenTo @model, 'change:isOver', @gameOver
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

    newGameConfirmation: =>
      @newGame() if window.confirm "Are you sure you want start a new game?"

    gameOver: =>
      $('.game-view').addClass('game-view_result')
      $('.game-result').html("Game over!<br><br>Tap to start over...")
      @$el.one "tap", => @newGame()

    updateStats: =>
      @$('#moves_count').html @model.get('moves')
