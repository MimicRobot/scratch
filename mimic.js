/*
  Mimic.js - adds custom scratch block to control the Mimic robot arm.
  Created by Zaron Thompson, June 28, 2017.
*/

(function (ext) {

	_self = ext;
	_baseUrl = "http://localhost:8080/mimic/api/";
	_enableButtonPressedEvent = false;
	_isButtonPressed = false;
	_enableKnobTurnedEvent = false;
	_isKnobTurned = false;
	
	listenForEvents = function()
	{
		if (_enableButtonPressedEvent == true)
		{
			send("ButtonPressed").then(function(data){
				if (data === true)
					_isButtonPressed = true;
			});
		}
		
		if (_enableKnobTurnedEvent == true)
		{
			send("KnobTurned").then(function(data){
				if (data === true)
					_isKnobTurned = true;
			});
		}
		
		//run again
		window.setTimeout(function() { listenForEvents(); }, 1000); //every 1 sec
	}
	
	
	send = function (cmd, params, ajaxOptions) {
		
		//generate url
		var url = _baseUrl + cmd
		if (params != null){
			var paramStr = "";
			for (var name in params) {
				paramStr += name + "=" + params[name] + "&"
			}
			if (paramStr.length > 0) {
				url += "?" + paramStr.substring(0, paramStr.length - 1);
			}
		}
		
		//send request
		var options = {
            url: url,
            dataType: 'jsonp',
            timeout : 2000
        };
		if (ajaxOptions != null)
			$.extend(options, ajaxOptions);
		return $.ajax(options);
	};

    ext._getStatus = function () {
        return { status: 2, msg: "Ready" };
    };
	
	ext.failedConnection = function() {
		return "Verify that the scratch module within the Mimic software is activated and running";
	};

    ext._shutdown = function () {
    };
	
	ext.ledOn = function(red, green, blue) {
		send("LedOn", {Red:red, Green:green, Blue:blue});
	};
	
	ext.ledOff = function() {
		send("LedOff");
	};

    ext.play = function(notes, callback) {
		send("Play", {Notes: notes}).always(callback);
	};
	
	ext.playback = function(recording, callback) {
		send("Playback", {Recording: recording}, {timeout : 60000}).always(callback);
	};
	
	ext.servosStop = function() {
		send("ServosStop");
	};
	
	ext.servosOff = function() {
		send("ServosOff");
	};
	
	ext.servoPosition = function(servoID, position) {
		send("ServoPosition", {ServoID: servoID, Position: position});
	};
	
	ext.servoMove = function(servoID, position, callback) {
		send("ServoMove", {ServoID: servoID, Position: position}, {timeout:30000}).always(callback);
	};
	
	ext.servoMoveAll = function(servo1Pos, servo2Pos, servo3Pos, servo4Pos, servo5Pos, callback) {
		send("ServoMoveAll", {Servo1Pos: servo1Pos, Servo2Pos: servo2Pos, Servo3Pos: servo3Pos, Servo4Pos: servo4Pos, Servo5Pos: servo5Pos}, {timeout:30000}).always(callback);
	};
	
	ext.servoMoveTarget = function(x, y, z, callback) {
		send("ServoMoveTarget", {X: x, Y: y, Z: z}, {timeout:30000}).always(callback);
	};
	
	ext.moveSettings = function(speed, easeIn, easeOut, sync) {
		send("MoveSettings", {Speed: speed, EaseIn: easeIn, EaseOut: easeOut, Sync: sync});
	};
	
	ext.servoOff = function(servoID) {
		send("ServoOff", {ServoID: servoID});
	};
	
	ext.buttonPressed = function(servoID) {
		_enableButtonPressedEvent = true;
		if (_isButtonPressed === true){
			_isButtonPressed = false;
			return true;
		}
		return false;
	};
	
	ext.knobTurned = function(servoID) {
		_enableKnobTurnedEvent = true;
		if (_isKnobTurned === true){
			_isKnobTurned = false;
			return true;
		}
		return false;
	};

    var descriptor = {
        blocks: [
		  ['w', 'playback %m.recordings', 'playback'],
		  ['w', 'move x:%n y:%n z:%n', 'servoMoveTarget', 0, 0, 0],
		  ['w', 'move shoulder:%n upper arm:%n forearm:%n hand:%n gripper:%n', 'servoMoveAll', 0, 0, 0, 0, 0],
		  ['w', 'move %m.servoID to position %n', 'servoMove', 'gripper', 0],
		  ['w', 'move settings speed:%n ease in:%n ease out:%n %m.sync', 'moveSettings', 50, 0, 0, 'synchronized'],
		  [' ', 'servos off', 'servosOff'],
		  [' ', 'servo %m.servoID off', 'servosOff', 'gripper'],
		  [' ', 'led on  red:%n green:%n blue:%n', 'ledOn', 255, 255, 255],
		  [' ', 'led off', 'ledOff'],
          ['w', 'play %s', 'play', 'C,E-16,R,C5-2'],
		  ['h', 'when button pressed', 'buttonPressed'],
		  ['h', 'when knob turned', 'knobTurned'],
        ],
		menus: {
			servoID: ['shoulder', 'upper arm', 'forearm', 'hand', 'gripper'],
			sync: ['synchronized', 'unsynchronized']
		},
        url: 'https://mimicrobot.github.io/scratch/'
    };
	
	send("GetRecordings").then(function(data){
		//success
		descriptor.menus.recordings = data;
		ScratchExtensions.register('Mimic robot arm', descriptor, ext);
		listenForEvents();
	}, function(){
		//failed
		ScratchExtensions.register('Mimic robot arm', {blocks: [['r', 'failed to connect to your robot arm', 'failedConnection']]}, ext);
	});
	

})({});