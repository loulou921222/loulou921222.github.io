function connect() {
   var IP = $('#IP').val();
   var port = $('#port').val();
   
   if ("WebSocket" in window) {
      $("#connectmenu").hide();
      try {
         // open websocket
         var ws = new WebSocket(`ws://${IP}:${port}/CTD`);
         
         ws.onopen = function() {
            
            // Web Socket is connected, send data using send()
            ws.send("Message to send");
            alert("Message is sent...");
         };
         
         ws.onmessage = function (evt) { 
            var received_msg = evt.data;
            alert("Message is received...");
         };
         
         ws.onclose = function() { 
            
            // websocket is closed.
            alert("Disconnected"); 
            $("#connectmenu").show();
         };
      }
      catch(e) {
         alert("Invalid IP or port");
         $("#connectmenu").show();
      }
   } else {
      alert("Websocket is not supported by your browser :c");
   }
}

function helptext() {
   alert("all players type out a string of characters, let's say player 1 types out \"bananA.\"\nplayer 2 sees my message and has to explain it to player 3 in a voice chat or just next to them\nplayer 3 has to type out the same string for the game to continue\nbe careful! someone might type in \"a in all caps\" or \"period question mark\" or something like that!");
}