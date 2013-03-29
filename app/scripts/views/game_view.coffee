class window.GameView extends Backbone.View

    el: $("body")

    events:
      'click #new_game': 'newGame'
      'click #solve_game': 'solveGame'

    initialize: ->
      @listenTo @model, 'change:solved', @gameSolved
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

    solveGame: =>
      @model.board.each (item) ->
        item.set { position: item.get('solution') }

    gameSolved: =>
      $('.game-view').addClass('game-view_result')
      $('.game-result').html("Congratulations! You solved puzzle in #{@model.get('moves')}&nbsp;moves.<br><br>Tap to start over...")
      @$el.one "tap", => @newGame()

    updateStats: =>
      @$('#moves_count').html @model.get('moves')
      @checkSolved()

    checkSolved: =>
      @model.setSolved() if @model.isSolved()
