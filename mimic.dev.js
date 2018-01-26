/*
  Mimic.js - adds custom scratch block to control the Mimic robot arm.
  Created by Zaron Thompson, June 28, 2017.
*/

(function (ext) {

	_self = ext;
	_baseUrl = "http://localhost:8080/mimic/api/";
	_isButtonPressed = false;
	_isKnobTurned = false;
	_listeningForEvents = false;
	_knobPosition = 0;
	_isLongButton = false;
	_buttonPressCount = 0;
	_shoulderPos = 0;
	_upperArmPos = 0;
	_forearmPos = 0;
	_handPos = 0;
	_gripperPos = 0;
	_xPos = 0;
	_yPos = 0;
	_zPos = 0;
	_isPositionChanged = false;
	_isTargetChanged = false;
	
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
	
	getServoID = function(servoName)
	{
		switch (servoName)
		{
			case "shoulder": return 1;
			case "upper arm": return 2;
			case "forearm": return 3;
			case "hand": return 4;
			case "gripper": return 5;
			default: return 1;
		}
	};
	
	getSynchronized = function(sync)
	{
		if (sync === "synchronized")
			return true;
		return false;
	};

    ext._getStatus = function () {
        return { status: 2, msg: "Ready" };
    };
	
	ext.failedConnection = function() {
		register();
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
		send("Play", {Notes: notes}, {timeout:6000}).always(callback);
	};
	
	ext.playback = function(recording) {
		//refresh the list
		if (recording === '<refresh>'){
			register();
		}
		
		//begin playback
		else
			send("Playback", {Recording: recording});
	};
	
	ext.servosStop = function() {
		send("ServosStop");
	};
	
	ext.servosOff = function() {
		send("ServosOff");
	};
	
	ext.servoPosition = function(servoName, position) {
		send("ServoPosition", {ServoID: getServoID(servoName), Position: position});
	};
	
	ext.servoMove = function(servoName, position) {
		send("ServoMove", {ServoID: getServoID(servoName), Position: position});
	};
	
	ext.servoMoveAll = function(servo1Pos, servo2Pos, servo3Pos, servo4Pos, servo5Pos) {
		send("ServoMoveAll", {Servo1Pos: servo1Pos, Servo2Pos: servo2Pos, Servo3Pos: servo3Pos, Servo4Pos: servo4Pos, Servo5Pos: servo5Pos});
	};
	
	ext.servoMoveTarget = function(x, y, z) {
		send("ServoMoveTarget", {X: x, Y: y, Z: z});
	};
	
	ext.moveSettings = function(speed, easeIn, easeOut, sync) {
		send("MoveSettings", {Speed: speed, EaseIn: easeIn, EaseOut: easeOut, Sync: getSynchronized(sync)});
	};
	
	ext.servoOff = function(servoName) {
		send("ServoOff", {ServoID: getServoID(servoName)});
	};
	
	ext.moveWait = function(callback) {
		send("MoveWait", null, {timeout:60000}).always(callback);
	};

	ext.targetOffset = function (x, y, z) {
		send("TargetOffset", { X: x, Y: y, Z: z });
	};
	
	ext.buttonPressed = function() {
		if (_isButtonPressed === true){
			_isButtonPressed = false;
			return true;
		}
		return false;
	};
	
	ext.knobTurned = function() {
		if (_isKnobTurned === true){
			_isKnobTurned = false;
			return true;
		}
		return false;
	};

	ext.positionChanged = function () {
		if (_isPositionChanged === true) {
			_isPositionChanged = false;
			return true;
		}
		return false;
	};

	ext.targetChanged = function () {
		if (_isTargetChanged === true) {
			_isTargetChanged = false;
			return true;
		}
		return false;
	};

	ext.isMoving = function(callback) {
		send("IsMoving").then(callback);
	};
	
	ext.isLongButton = function(callback) {
		return _isLongButton;
	};
	
	ext.getButtonPressCount = function(callback) {
		return _buttonPressCount;
	};
	
	ext.resetButtonPressCount = function(servoName) {
		send("ResetButtonPressCount");
	};
	
	ext.setKnobPosition = function(position, minRange, maxRange) {
		send("SetKnobPosition", {Position: position, MinRange: minRange, MaxRange: maxRange});
	};

	ext.getKnobPosition = function () {
		return _knobPosition;
	};

	ext.shoulderPos = function () {
		return _shoulderPos;
	};

	ext.upperArmPos = function () {
		return _upperArmPos;
	};

	ext.forearmPos = function () {
		return _forearmPos;
	};

	ext.handPos = function () {
		return _handPos;
	};

	ext.gripperPos = function () {
		return _gripperPos;
	};

	ext.xPos = function () {
		return _xPos;
	};

	ext.yPos = function () {
		return _yPos;
	};

	ext.zPos = function () {
		return _zPos;
	};

	listenForEvents = function () {

		//run once
		if (_listeningForEvents)
			return;
		_listeningForEvents = true;

		events = function () {
			send("AwaitEvent", null, { timeout: 600000 }).done(function (data) {
				//Position
				if (typeof data.Position !== 'undefined') {
					_shoulderPos = data.Position.Shoulder || 0;
					_upperArmPos = data.Position.UpperArm || 0;
					_forearmPos = data.Position.Forearm || 0;
					_handPos = data.Position.Hand || 0;
					_gripperPos = data.Position.Gripper || 0;
					_isPositionChanged = true;
				}
				//Target
				else if (typeof data.Target !== 'undefined') {
					_xPos = data.Target.X || 0;
					_yPos = data.Target.Y || 0;
					_zPos = data.Target.Z || 0;
					_isTargetChanged = true;
				}
				//knob
				else if (typeof data.Knob !== 'undefined') {
					_knobPosition = data.Knob;
					_isKnobTurned = true;
				}
				//button
				else if (typeof data.Button !== 'undefined') {
					_buttonPressCount = data.Button.Count;
					_isLongButton = data.Button.WasLong;
					_isButtonPressed = true;
				}
				events(); //loop

			}).fail(function () { 
				window.setTimeout(function () { events(); }, 10000); //retry in 10 sec
			});
		};
		events();
	}

    var descriptor = {
        blocks: [
		  [' ', 'playback %m.recordings', 'playback'],
		  [' ', 'move to x:%n y:%n z:%n', 'servoMoveTarget', 0, 0, 0],
		  [' ', 'move shoulder:%n upper arm:%n forearm:%n hand:%n gripper:%n', 'servoMoveAll', 0, 0, 0, 0, 0],
		  [' ', 'move %m.servoName to position %n', 'servoMove', 'gripper', 0],
		  ['w', 'wait until done', 'moveWait'],
		  [' ', 'move settings speed:%n ease in:%n ease out:%n %m.sync', 'moveSettings', 50, 0, 0, 'synchronized'],
		  ['R', 'is moving', 'isMoving'],
		  [' ', 'position %m.servoName at %n', 'servoPosition', 'gripper', 0],
		  [' ', 'stop moving', 'servosStop'],
		  [' ', 'servos off', 'servosOff'],
		  [' ', 'servo %m.servoName off', 'servoOff', 'gripper'],
		  ['h', 'when postion changed', 'positionChanged']
		  ['r', 'shoulder position', 'shoulderPos'],
		  ['r', 'upper arm position', 'upperArmPos'],
		  ['r', 'forearm position', 'forearmPos'],
		  ['r', 'hand position', 'handPos'],
		  ['r', 'gripper position', 'gripperPos'],
		  ['h', 'when target changed', 'targetChanged']
		  ['r', 'x', 'xPos'],
		  ['r', 'y', 'yPos'],
		  ['r', 'z', 'zPos'],
		  [' ', 'set target offset to x:%n y:%n z:%n', 'targetOffset', 0, 0, 0],
		  [' ', 'led on  red:%n green:%n blue:%n', 'ledOn', 255, 255, 255],
		  [' ', 'led off', 'ledOff'],
          ['w', 'play %s', 'play', 'C,E-16,R,C5-2'],
		  ['h', 'when button pressed', 'buttonPressed'],
		  ['r', 'was a long button pressed', 'isLongButton'],
		  ['r', 'button press count', 'getButtonPressCount'],
		  [' ', 'reset button press count', 'resetButtonPressCount'],
		  ['h', 'when knob turned', 'knobTurned'],
		  [' ', 'set knob position:%n min:%n max:%n', 'setKnobPosition', 0, -100, 100],
		  ['r', 'knob position', 'getKnobPosition'],
        ],
		menus: {
			servoName: ['shoulder', 'upper arm', 'forearm', 'hand', 'gripper'],
			sync: ['synchronized', 'unsynchronized']
		},
        url: 'https://mimicrobot.github.io/scratch/'
    };
	
	register = function(){
		//unregister old
		ScratchExtensions.unregister('Mimic robot arm');
		
		//register new
		send("GetRecordings").then(function(data){
			//success
			if (data != null)
				data.push('<refresh>')
			descriptor.menus.recordings = data;
			ScratchExtensions.register('Mimic robot arm', descriptor, ext);
			listenForEvents();
		}, function(){
			//failed
			ScratchExtensions.register('Mimic robot arm', {blocks: [['r', 'failed to connect - refresh', 'failedConnection']]}, ext);
		});
	};
	register();
	

})({});