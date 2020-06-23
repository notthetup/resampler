# Audio-Resampler

[![npm version](https://badge.fury.io/js/audio-resampler.svg)](http://badge.fury.io/js/audio-resampler)

Simple WebAudio based resampling library.


#### Runs on all [modern browsers which support WebAudio](http://caniuse.com/#search=audio-api).

## Installation

`npm install audio-resampler`

## API

```
resampler = require('audio-resampler');
resampler(input, targetSampleRate, oncomplete);
```

`input` : Input audio file. This can either be a URL, a File object, or an AudioBuffer.

`targetSampleRate` : The target sample rate after the re-sampling process. This number is limted based on the browser implementation (usually >=3000, <=192000)

`targetBitDepth` : The target bit depth after the re-sampling process. This number is limted based on the browser implementation (usually >=16, <=32)

`oncomplete`: Callback when the resampling process is completed. The argument to this callback is an Object which supports the following methods:

`getAudioBuffer` : Returns the resampler AudioBuffer

`getFile` : Returns a ObjectURL of a WAV file created from the resampled Audio.

## Example Usage

```
resampler = require('audio-resampler');
var URL = "https://dl.dropboxusercontent.com/u/957/audio/sine.wav"
resampler(URL, 192000, 24, function(event){
	event.getFile(function(fileEvent){
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.download = "resampled.wav";
		a.style = "display: none";
		a.href = fileEvent;
		a.click();
		window.URL.revokeObjectURL(fileEvent);
		document.body.removeChild(a);
	});
});
```

## Test

To test this repository, you can run a local server using the `npm start` command which serves a simple drag-and-drop interface based webpage to resampler audio files.


