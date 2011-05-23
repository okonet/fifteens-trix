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

  newGame: ->
    @board.shuffle()
    @set { moves: 0 }

window.Game = Game
