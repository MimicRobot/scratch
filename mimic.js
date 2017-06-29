/*
  Mimic.js - adds custom scratch block to control the Mimic robot arm.
  Created by Zaron Thompson, June 28, 2017.
*/

(function (ext) {

	_self = ext;
	ext._baseUrl = "http://localhost:8080/mimic/api/";
	
	ext.send = function (cmd, params, ajaxOptions) {
		
		//generate url
		var url = _self._baseUrl + cmd
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
		_self.send("LedOn", {Red:red, Green:green, Blue:blue});
	};
	
	ext.ledOff = function() {
		_self.send("LedOff");
	};

    ext.play = function(notes, callback) {
		_self.send("Play", {Notes: notes}).always(callback);
	};
	
	ext.playback = function(recording, callback) {
		_self.send("Playback", {Recording: recording}, {timeout : 60000}).always(callback);
	};
	
	ext.servosStop = function() {
		_self.send("ServosStop");
	};
	
	ext.servosOff = function() {
		_self.send("ServosOff");
	};

    var descriptor = {
        blocks: [
		  ['w', 'playback %m.recordings', 'playback'],
		  [' ', 'stop servos', 'servosStop'],
		  [' ', 'servos off', 'servosOff'],
		  [' ', 'led on  red%n green%n blue%n', 'ledOn', 255, 0, 0],
		  [' ', 'led off', 'ledOff'],
          ['w', 'play %s', 'play', 'C,E-16,R,C5-2'],
		  
        ],
        url: 'https://mimicrobot.github.io/scratch/'
    };
	
	_self.send("GetRecordings").then(function(data){
		//success
		descriptor.menus = {recordings: data};
		ScratchExtensions.register('Mimic robot arm', descriptor, ext);
	}, function(){
		//failed
		ScratchExtensions.register('Mimic robot arm', {blocks: [['r', 'failed to connect to your robot arm', 'failedConnection']}, ext);
	});
	

})({});