/*
  Mimic.js - adds custom scratch block to control the Mimic robot arm.
  Created by Zaron Thompson, June 28, 2017.
*/

(function (ext) {

	_self = ext;
	ext._baseUrl = "http://localhost:8080/mimic/api/";
	
	ext.send = function (cmd, params, callback) {
		
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
		return $.ajax({
            url: url,
            dataType: 'jsonp',
            timeout : 2000
        });
	};

    ext._getStatus = function () {
        return { status: 2, msg: "Ready" };
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
		_self.send("Playback", {Recording: recording}).always(callback);
	};

    var descriptor = {
        blocks: [
		  ['w', 'playback %m.recordings', 'playback'],
		  [' ', 'led on  red%n green%n blue%n', 'ledOn', 255, 0, 0],
		  [' ', 'led off', 'ledOff'],
          ['w', 'play %s', 'play', 'C,E-16,R,C5-2'],
		  
        ],
        url: 'https://mimicrobot.github.io/scratch/'
    };
	
	_self.send("GetRecordings").then(function(data){
		
		descriptor.menus = {recordings: data};
		
		ScratchExtensions.register('Mimic robot arm', descriptor, ext);
	});

    //ScratchExtensions.register('Mimic robot arm', descriptor, ext);

})({});