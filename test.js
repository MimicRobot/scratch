/*
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function (ext) {

    ext._getStatus = function () {
        return { status: 2, msg: 'Ready' };
    };

    ext._shutdown = function () {
    };

    ext.sayHello = function (text, callback) {
        $.ajax({
            url: 'http://localhost:8080/hello/SayHello?name=' + text,
            dataType: 'jsonp',
            success: function (data) {
                callback(data);
            },
            error: function (error) {
                callback(error);
            }
        });
    };

    var descriptor = {
        blocks: [
          ['R', 'say hello %s', 'sayHello', 'world']
        ],
        url: 'https://mimicrobot.github.io/scratch/'
    };

    ScratchExtensions.register('ISS Tracker', descriptor, ext);

})({});