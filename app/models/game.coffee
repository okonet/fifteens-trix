#
#  game.coffee
#  fifteens
#
#  Created by Andrew Okonetchnikov on 2011-05-24.
#  Copyright 2011 sauspiel.de. All rights reserved.
#

class Game extends Backbone.Model

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

window.Game = Game
