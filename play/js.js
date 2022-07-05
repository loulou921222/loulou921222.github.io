var ws;
var playerCount = 0;
var players = []
var permissionLevel = 0;
var submitted = 0;
var myguess;

function connect() {
   var username = $('#username').val();
   var IP = $('#IP').val();
   var port = $('#port').val();

   if ("WebSocket" in window) {
      $("#connectmenudiv").hide();
      var state = 0;
      try {
         // open websocket
         ws = new WebSocket(`ws://${IP}:${port}/CTD`);
         
         ws.onopen = function() {
            $("#playerlistdiv").show();
            $(".username").text(username);
            $(".usernamediv").show();
            // Web Socket is connected, send data using send()
            ws.send(`clientConnect ${username}`);
         };
         
         ws.onmessage = function (evt) { 
            var receivedText = evt.data;
            var command = receivedText.slice(0, receivedText.indexOf(" "));
            var data = receivedText.slice(receivedText.indexOf(" ") + 1);
            if (command == "playerCount") {
               playerCount = parseInt(data);
               $(".playercount").text(playerCount);
            }
            if (command == "players") {
               players = data.split(" ")
               $(".playerlist").text("")
               for (playerindex = 0; playerindex < players.length; playerindex++) {
                  if (playerindex == 0) {
                     var listitem = '<li>'+ players[playerindex] + ' (leader)</li>';
                  }
                  else {
                     var listitem = '<li>'+ players[playerindex] +'</li>';
                  }
                  $('.playerlist').append(listitem);
               }
            }
            if (command == "permissionLevel") {
               permissionLevel = parseInt(data);
               if (permissionLevel) {
                  $(".leadermsg").show();
                  $(".startbtn").show();
                  if (state != 0) {
                     $("#endgamediv").show();
                  }
               }
               else {
                  $(".leadermsg").hide();
                  $(".startbtn").hide();
                  if (state != 0) {
                     $("#endgamediv").hide();
                  }
               }
            }
            if (command == "gameStarted") {
               bsalert("This game has already started!");
            }
            if (command == "gameStart") {
               state = 1;
               $("#playerlistdiv").hide();
               $("#enterstringdiv").show();
               $("#inputstring").focus();
               if (permissionLevel == 1) {
                  $("#endgamediv").show();
               }
            }
            if (command == "gameEnded") {
               state = 0;
               if (data == "notEnoughPlayers") {
                  bsalert("Game has ended as there are no longer enough players.");
               }
               if (data == "leaderEnded") {
                  bsalert("Leader ended game.");
               }
               $("#endgamediv").hide();
               $("#enterstringdiv").hide();
               $("#submittedplayersdiv").hide();
               $("#playerlistdiv").show();
               submitted = 0;
            }
            if (command == "submittedPlayers") {
               var submittedPlayers = parseInt(data);
               if (submitted) {
                  var remainingPlayers = playerCount - submittedPlayers;
                  $("#enterstringdiv").hide();
                  $("#submittedplayersdiv").show();
                  $(".waitingplayerscount").text(remainingPlayers);
                  if (remainingPlayers == 1) {
                     $(".waitingplayersplural").text("player");
                     $(".stringsplural").text("string");
                  }
                  else {
                     $(".waitingplayersplural").text("players");
                     $(".stringsplural").text("strings");
                  }
               }
            }
            if (command == "guessStart") {
               state = 2;
               $("#submittedplayersdiv").hide();
            }
            if (command == "explainer") {
               console.log(`explainer ${data}`)
            }
            if (command == "guesser") {
               console.log(`guesser ${data}`)
            }
            if (command == "string") {
               console.log(`string ${data}`)
            }
         };
         
         ws.onclose = function() { 
            // websocket is closed.
            bsalert("Disconnected");
            gamereset();

         };
      }
      catch(e) {
         bsalert("Invalid IP or port");
         gamereset();
      }
   } else {
      alert("Websocket is not supported by your browser :c");
   }
}

function gamereset() {
   ws = undefined;
   playerCount = 0;
   players = []
   permissionLevel = 0;
   submitted = 0;
   $("#endgamediv").hide()
   $("#enterstringdiv").hide();
   $("#playerlistdiv").hide();
   $(".usernamediv").hide();
   $("#submittedplayersdiv").hide()
   $("#connectmenudiv").show();
};

function helptext() {
   helpalert();
};

function startbtnclick() {
   if (playerCount < 3) {
      bsalert("3 or more players are required to start!");
   }
   else {
      ws.send("requestStart null");
   }
};

function submitstring() {
   submitted = 1;
   myguess = $('#inputstring').val()
   ws.send(`submitString ${myguess}`);
   $('#inputstring').val("");
};

function endgame() {
   ws.send("endGame null");
};

function onload() {
   $("#username").focus();
};

function replaceillegalchars(e) {
   var validChars = [' ', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', '{', ']', '}', '\\', '|', ';', ':', "'", '"', ',', '<', '.', '>', '/', '?'];
   var valid = "";
   for (var char = 0; char < e.value.length; char++) {
      if (validChars.includes(e.value[char])) {
         valid += e.value[char];
      }
      else {
         $(".illegalchar").val(valid);
      }
   }
};

function bsalert(text) {
   $("#alertbox").addClass("show");
   $("#alerttext").html(text);
   $("#alertclosebtn").focus();
};

function bsinfo(text) {
   var toast = document.getElementById("infobox");
   var bstoast = new bootstrap.Toast(toast);
   bstoast.show();
   $("#infotext").html(text);
};

function helpalert() {
   $("#helpbox").addClass("show");
   $("#helpclosebtn").focus();
};