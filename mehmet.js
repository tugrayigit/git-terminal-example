$(document).ready( function() {
    'use strict';
  
    var pieces = {
      "R" : "&#9820;",
      "N" : "&#9822;",
      "B" : "&#9821",
      "Q" : "&#9819",
      "K" : "&#9818",
      "P" : "&#9823",
      "r" : "&#9814",
      "n" : "&#9816",
      "b" : "&#9815",
      "q" : "&#9813",
      "k" : "&#9812",
      "p" : "&#9817",
    };
  
    var board = [
      ['R','N','B','Q','K','B','N','R'],
      ['P','P','P','P','P','P','P','P'],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      ['p','p','p','p','p','p','p','p'],
      ['r','n','b','q','k','b','n','r'] ];
    
    $("#00").html(pieces.R);
    $("#01").html(pieces.N);
    $("#02").html(pieces.B);
    $("#03").html(pieces.Q);
    $("#04").html(pieces.K);
    $("#05").html(pieces.B);
    $("#06").html(pieces.N);
    $("#07").html(pieces.R);
    $("#10").html(pieces.P);
    $("#11").html(pieces.P);
    $("#12").html(pieces.P);
    $("#13").html(pieces.P);
    $("#14").html(pieces.P);
    $("#15").html(pieces.P);
    $("#16").html(pieces.P);
    $("#17").html(pieces.P);
    
    $(".btn-step-forward").click(function() {
         $("#63").html("");
         $("#43").html(pieces.p);
  
    });
    $(".btn-step-back").click(function() {
        $("#43").html("");
        $("#63").html(pieces.p);
    });
  
      
    }); //This ends the file
  
  
  // $(document).ready(function() {
  //   "use strict";
    
  //     var R = "&#9820";
  //     var N = "&#9822";
  //     var B = "&#9821";
  //     var Q = "&#9819";
  //     var K = "&#9818";
  //     var P = "&#9823";
  
  //   var board = [
  //     ["R", 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  //   ]
  
  //   console.log(board);
  //   document.write(board);
  
  // }); //This ends the file
  
  // var elements = $();
  // for(x = 0; x < 8; x++) {
  //    elements = board.add(element);
  // }
  // $('body').append(elements);
  
  //  var board = [
  //   ['R','N','B','Q','K','B','N','R'],
  //   ['P','P','P','P','P','P','P','P'],
  //   [' ',' ',' ',' ',' ',' ',' ',' '],
  //   [' ',' ',' ',' ',' ',' ',' ',' '],
  //   [' ',' ',' ',' ',' ',' ',' ',' '],
  //   [' ',' ',' ',' ',' ',' ',' ',' '],
  //   ['p','p','p','p','p','p','p','p'],
  //   ['r','n','b','q','k','b','n','r'] ];
  
  // console.log(board.join('\n') + '\n\n');
  
  // // Move King's Pawn forward 2
  // board[4][4] = board[6][4];
  // board[6][4] = ' ';
  // console.log(board.join('\n'));