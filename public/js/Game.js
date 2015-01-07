$(document).ready(function() {

  $("#play").click(function(event) {
    event.preventDefault();
    $("#game-intro").hide();
  });

  document.body.style.overflow = 'hidden';

  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;

  var keysDown = {};
  var ship = new Ship();
  var otherShips = {};

  var socket = io.connect('/');

  addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  }, false);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  var setShipLocation = function () {
    ship.x = 24 + (Math.random() * (context.canvas.width - 48));
    ship.y = 24 + (Math.random() * (context.canvas.height - 48));
  };

  var update = function(modifier) {
    if (38 in keysDown) {
      ship.y -= ship.speed * modifier;

      // if (ship.y > context.canvas.height - 24) {
      //     ship.y = 100;
      // }
    }
    if (40 in keysDown) { // Player holding down
      ship.y += ship.speed * modifier;

      // if (ship.y < 100) {
      //   ship.y = context.canvas.height - 24;
      // }
    }
    if (37 in keysDown) { // Player holding left
      ship.x -= ship.speed * modifier;

      if (ship.x < 24) {
        ship.x = context.canvas.width - 24;
      }
    }
    if (39 in keysDown) {
      ship.x += ship.speed * modifier;

      if (ship.x > context.canvas.width - 24) {
        ship.x = 24;
      }
    }

    socket.emit('move ship', {x: ship.x, y: ship.y});

    // if (
    //   h.x <= (monster.x + 32)
    //   && m.x <= (h.x + 32)
    //   && h.y <= (m.y + 32)
    //   && m.y <= (h.y + 32)
    // ) {
    //
    // }
  };

  socket.on('existing ship', function(shipData) {
    otherShips[shipData.id] = new Ship();
    otherShips[shipData.id].id = shipData.id;
    otherShips[shipData.id].x = shipData.x;
    otherShips[shipData.id].y = shipData.y;
  });

  socket.on('new ship', function(shipData) {
    otherShips[shipData.id] = new Ship();
    otherShips[shipData.id].id = shipData.id;
    otherShips[shipData.id].x = shipData.x;
    otherShips[shipData.id].y = shipData.y;
  });

  socket.on('move ship', function(shipData) {
    otherShips[shipData.id].x = shipData.x;
    otherShips[shipData.id].y = shipData.y;
  });

  socket.on('delete ship', function(shipData) {
    delete otherShips[shipData.id];
  })

  var render = function() {
    context.clearRect (0 , 0 , canvas.width, canvas.height);

    context.fillStyle = "#ffffff";
    context.beginPath();
    context.moveTo(ship.x - ship.width / 2, ship.y + ship.height / 2);
    context.lineTo(ship.x + ship.width / 2, ship.y + ship.height / 2);
    context.lineTo(ship.x, ship.y - ship.height / 2);
    context.fill();
  };

  var drawOtherShips = function(shipsData) {
    for (var keys in otherShips) {
      context.fillStyle = "#ff0000";
      context.beginPath();
      context.moveTo(otherShips[keys].x - 12, otherShips[keys].y + 12);
      context.lineTo(otherShips[keys].x + 12, otherShips[keys].y + 12);
      context.lineTo(otherShips[keys].x, otherShips[keys].y - 12);
      context.fill();
    };
  };

  var main = function() {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();
    drawOtherShips();

    then = now;

    requestAnimationFrame(main);
  };

  var then = Date.now();
  setShipLocation();

  socket.emit('start', {x: ship.x, y: ship.y});

  main();
});