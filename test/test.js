var resampler = require('../index');

window.addEventListener('load', function(){
	resampler('https://dl.dropboxusercontent.com/u/77191118/sounds/deep10.mp3',192000, function(event){
		console.log(event.getFile(function(fileEvent){
			console.log(fileEvent);
			var a = document.createElement("a");
			document.body.appendChild(a);
			a.style = "display: none";
			a.href = fileEvent;
			a.download = "resampled.wav";
			a.click();
			window.URL.revokeObjectURL(fileEvent);
		}));
	})
})
