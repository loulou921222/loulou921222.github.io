function connect() {
   var username = $('#username').val();
   var IP = $('#IP').val();
   var port = $('#port').val();
   
   if ("WebSocket" in window) {
      $("#connectmenu").hide();
      var playerCount = 0;
      var players = []

      try {
         // open websocket
         var ws = new WebSocket(`ws://${IP}:${port}/CTD`);
         
         ws.onopen = function() {
            $("#playerlist").show();
            $(".username").text(username);
            $(".username").show();
            // Web Socket is connected, send data using send()
            ws.send(`clientConnect ${username}`);
         };
         
         ws.onmessage = function (evt) { 
            var receivedText = evt.data;
            var command = receivedText.slice(0, receivedText.indexOf(" "));
            var data = receivedText.slice(receivedText.indexOf(" ") + 1);
            if (command == "playerCount") {
               playerCount = parseInt(data);
               $(".playerCount").text(playerCount);
            }
            if (command == "players") {
               players = data.split(" ")
               $(".playerList").text("")
               for (playerindex = 0; playerindex < players.length; playerindex++) {
                  var listitem = '<li>'+ players[playerindex] +'</li>';
                  $('.playerList').append(listitem);
               }
            }
         };
         
         ws.onclose = function() { 
            // websocket is closed.
            alert("Disconnected");
            $("#playerlist").hide();
            $(".username").hide();
            $("#connectmenu").show();
         };
      }
      catch(e) {
         alert("Invalid IP or port");
         $("#playerlist").hide();
         $(".username").hide();
         $("#connectmenu").show();
      }
   } else {
      alert("Websocket is not supported by your browser :c");
   }
}

function helptext() {
   alert("all players type out a string of characters, let's say player 1 types out \"bananA.\"\n\nplayer 2 sees my message and has to explain it to player 3 in a voice chat or just next to them\n\nplayer 3 has to type out the same string for the game to continue\n\nbe careful! someone might type in \"a in all caps\" or \"period question mark\" or something like that!");
}