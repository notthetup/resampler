"use strict";

var resampler = require('./lib/resampler.js');
var dragDrop = require('drag-drop');

window.addEventListener('load', function(){
	// dom elements
	var fSelectOption = document.getElementById('freqSelect');
	var messageBox = document.getElementById('message');
	var input = document.getElementById('input');
	var note = document.getElementById('note');
	var spinner = document.getElementById('spinner');

	//monkeypatch
	var ddEventListeners = {};
	var dropzone = document.querySelector('#dropzone');
	var dEL = dropzone.addEventListener.bind(dropzone);

	dropzone.addEventListener = function(event, callback, flag){
		ddEventListeners[event] = callback;
		dEL(event,callback,flag);
	};

	var disableDragDrop = function(elem) {
		elem.removeEventListener ('dragenter', ddEventListeners.dragenter);
		elem.removeEventListener('dragover', ddEventListeners.dragover);
		elem.removeEventListener('drop', ddEventListeners.drop);
	};

	dragDrop('#dropzone', resampleDraggedFiles);

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

	function resampleDraggedFiles(files){
		var chosenFile = files[0] || files;
		var chosenSampleRate = parseInt(fSelectOption.selectedOptions[0].value);
		console.log(chosenFile,chosenSampleRate);
		resampleFile(chosenFile,chosenSampleRate);
	}

	function resampleFile (file, targetSampleRate){
		// note.messageBox.
		note.style.display = "none";
		spinner.style.display = "inherit";
		input.disabled = true;
		disableDragDrop(dropzone);
		resampler(file, targetSampleRate, function(event){
			event.getFile(function(fileEvent){
				console.log(fileEvent);
				spinner.style.display = "none";
				note.style.display = "inherit";
				input.disabled = false;
				dragDrop('#dropzone');
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style.display = "none";
				a.href = fileEvent;
				var fileExt = file.name.split('.').pop();
				var fileName = file.name.substr(0, file.name.length-fileExt.length-1);
				a.download = fileName + "_resampled."+ fileExt;
				a.click();
				window.URL.revokeObjectURL(fileEvent);
				document.body.removeChild(a);
			});
		});
	}
});
