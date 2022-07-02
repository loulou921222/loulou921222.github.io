var ws;
var playerCount = 0;
var players = []
var permissionLevel = 0;

function connect() {
   var username = $('#username').val();
   var IP = $('#IP').val();
   var port = $('#port').val();
   
   if ("WebSocket" in window) {
      $("#connectmenudiv").hide();
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
                  $(".leadermsg").show()
                  $(".startbtn").show()
               }
               else {
                  $(".leadermsg").hide()
                  $(".startbtn").hide()
               }
            }
         };
         
         ws.onclose = function() { 
            // websocket is closed.
            alert("Disconnected");
            ws = undefined;
            playerCount = 0;
            players = []
            permissionLevel = 0;
            $("#playerlistdiv").hide();
            $(".usernamediv").hide();
            $("#connectmenudiv").show();
         };
      }
      catch(e) {
         alert("Invalid IP or port");
         ws = undefined;
         playerCount = 0;
         players = []
         permissionLevel = 0;
         $("#playerlistdiv").hide();
         $(".usernamediv").hide();
         $("#connectmenudiv").show();
      }
   } else {
      alert("Websocket is not supported by your browser :c");
   }
}

function helptext() {
   alert("all players type out a string of characters, let's say player 1 types out \"bananA.\"\n\nplayer 2 sees my message and has to explain it to player 3 in a voice chat or just next to them\n\nplayer 3 has to type out the same string for the game to continue\n\nbe careful! someone might type in \"a in all caps\" or \"period question mark\" or something like that!");
};

function startbtnclick() {
   if (playerCount < 3) {
      alert("3 or more players are required to start!");
   }
   else {
      ws.send("requestStart null");
   }
};