"use strict";

var resampler = require('./lib/resampler.js');
var dragDrop = require('drag-drop');

window.addEventListener('load', function(){

	var fSelectOption = document.getElementById('freqSelect');
	var messageBox = document.getElementById('message');
	var input = document.getElementById('input');
	var note = document.getElementById('note');
	var spinner = document.getElementById('spinner');
	messageBox.addEventListener('click', function (){
		input.click();
	});

	input.addEventListener('change', function(evt){
		var chosenFile = evt.target.files[0];
		if (chosenFile){
			var chosenSampleRate = parseInt(fSelectOption.selectedOptions[0].value);
			console.log(chosenFile,chosenSampleRate);
			resampleFile(chosenFile,chosenSampleRate);
		}

	});

	dragDrop('#dropzone', function (files) {
		var chosenFile = files[0] || files;
		var chosenSampleRate = parseInt(fSelectOption.selectedOptions[0].value);
		console.log(chosenFile,chosenSampleRate);
		resampleFile(chosenFile,chosenSampleRate);
	});

	function resampleFile (file, targetSampleRate){
		// note.messageBox.
		note.style.display = "none";
		spinner.style.display = "inherit";
		input.disabled = true;
		resampler(file, targetSampleRate, function(event){
			event.getFile(function(fileEvent){
				console.log(fileEvent);
				spinner.style.display = "none";
				note.style.display = "inherit";
				input.disabled = false;
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				a.href = fileEvent;
				a.download = "resampled.wav";
				a.click();
				window.URL.revokeObjectURL(fileEvent);
				document.body.removeChild(a);
			});
		});
	}
});
