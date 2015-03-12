"use strict";

var resampler = require('./lib/resampler.js');

window.addEventListener('load', function(){
	resampler('https://dl.dropboxusercontent.com/u/77191118/sounds/Hit5.mp3',192000, function(event){
			event.getFile(function(fileEvent){
				console.log(fileEvent);
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				a.href = fileEvent;
				a.download = "resampled.wav";
				a.click();
				window.URL.revokeObjectURL(fileEvent);
			});
	});
});
