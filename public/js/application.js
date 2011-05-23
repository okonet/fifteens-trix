// 
//  fifteens.js
//  
//  Created by Andrew Okonetchnikov on 2011-04-10.
//  Copyright 2011 okonet.ru. All rights reserved.
// 

//= require <zepto>
//= require <underscore>
//= require <backbone>

//= require "models/tile"
//= require "models/board"
//= require "models/game"

//= require "views/tile_view"
//= require "views/board_view"
//= require "views/game_view"

$(function(){
  
  window.gameView = new GameView({ model: new Game });
  
});