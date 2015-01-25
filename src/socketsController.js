var socket = function(io) {
  var remoteShips = {};

  io.on('connection', function(socket) {

    console.log(socket.id + ' connected');
    for (var keys in remoteShips) {
      io.to(socket.id).emit("existing ship", {id: remoteShips[keys].id, x: remoteShips[keys].x, y: remoteShips[keys].y});
    };
    remoteShips[socket.id] = {id: socket.id};

    socket.on('disconnect', function() {
      console.log(socket.id + ' disconnected');
      delete remoteShips[socket.id];
      io.emit("delete ship", {id: socket.id});
    });

    socket.on('start', function(shipData) {
      remoteShips[socket.id].x = shipData.x;
      remoteShips[socket.id].y = shipData.y;
      socket.broadcast.emit("new ship", {id: socket.id, x: shipData.x, y: shipData.y});
    });

    socket.on('move ship', function(shipData) {
      remoteShips[socket.id].x = shipData.x;
      remoteShips[socket.id].y = shipData.y;
      socket.broadcast.emit("move ship", {id: remoteShips[socket.id].id, x: remoteShips[socket.id].x, y: remoteShips[socket.id].y})
    });
  });
};

module.exports = socket;





// var socket = function(io) {
//   io.on('connection', onSocketConnection);
// };
//
// function onSocketConnection(socket) {
//   console.log('New player has connected ' + socket.id);
//   remoteShips[socket.id] = {id: socket.id};
//   socket.on('start', onNewPlayer);
//   socket.on('move player', onMovePlayer);
//   socket.on('disconnect', onSocketDisconnection);
//
//   // var length = Object.keys(remoteShips).length;
//   // console.log(remoteShips);
//   // if (length > 0) {
//   //   for (var keys in remoteShips) {
//   //     console.log("broadcast");
//   //     socket.broadcast.emit("all ships", {id: keys, x: remoteShips[keys].x, y: remoteShips[keys].y});
//   //   }
//   // };
//
//   for (var keys in remoteShips) {
//     socket.emit("all ships", {id: keys, x: remoteShips[keys].x, y: remoteShips[keys].y});
//   };
// };
//
// function onSocketDisconnection() {
//   console.log('Player has disconnected ' + this.id);
//   delete remoteShips[this.id];
// };
//
// function onNewPlayer() {
//   // var newShip = new Ship();
//   // remoteShips[this.id] = newShip;
//   // broadcastShips();
// };
//
// function onMovePlayer(data) {
//   var length = Object.keys(remoteShips).length;
//
//   // if (length > 0) {
//     remoteShips[this.id] = {x: data.shipX};
//     remoteShips[this.id] = {y: data.shipY};
//
//   // broadcastShips();
//   // console.log(length);
// };
//
// // function broadcastShips() {
// //   for (var keys in remoteShips) {
// //     socket.emit("all ships", {id: keys, x: remoteShips[keys].x, y: remoteShips[keys].y});
// //   };
// // };
