/*
  Mimic.js - adds custom scratch block to control the Mimic robot arm.
  Created by Zaron Thompson, June 28, 2017.
*/

(function (ext) {

	ext._errorMsg = "ERROR: scratch integration not enabled in Mimic software!";
	ext._baseUrl = "http://localhost:8080/mimic/api/";

    ext._getStatus = function () {
        return { status: 2, msg: 'Ready' };
    };

    ext._shutdown = function () {
    };

    ext.sayHello = function (text, callback) {
        $.ajax({
            url: "_baseUrl" + "SayHello?name=" + text,
            dataType: 'jsonp',
            timeout : 2000,
            success: function (data) {
                callback(data);
            },
            error: function (error) {
                callback(_errorMsg);
            }
        });
    };

    var descriptor = {
        blocks: [
          ['R', 'say hello %s', 'sayHello', 'world']
        ],
        url: 'https://mimicrobot.github.io/scratch/'
    };

    ScratchExtensions.register('Mimic robot arm', descriptor, ext);

})({});