"use strict";

var WebAudioLoader = require('webaudioloader');
var encoder = require('encode-wav');

// WebAudio Shim.
window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();

var wal = new WebAudioLoader({
	context : audioContext,
	cache : false
});

/*
* resampler = require('resampler');
* resampler(file/URL/AudioBuffer, samplerRate, oncomplete) -> Promise
* event.getFile();
* event.getAudioBuffer();
*/


/*
*
*/
function resampler(file, targetSampleRate, oncomplete){

	if (!file && !targetSampleRate){
		console.error('Error: First two arguments (audio file & target sample rate) are mandatory');
		return; // return Rejected Promise
	}

	var inputType = Object.prototype.toString.call( file );
	if (inputType !== '[object String]' && inputType !== '[object File]' &&
		inputType !== '[object Blob]' && inputType !== '[object AudioBuffer]'){
		console.error('Error: First argument should be either a File, URL or AudioBuffer');
		return; // return Rejected Promise
	}

	if(typeof targetSampleRate !== 'number' || targetSampleRate > 192000 || targetSampleRate < 3000){
		console.error('Error: Second argument should be a numeric sample rate between 3000 and 192000');
		return; // return Rejected Promise
	}

	if (inputType !== '[object AudioBuffer]'){
		console.log('Loading/decoding file', file);
		wal.load(file, {onload: fileDecodedCallback});
	} else{
		fileDecodedCallback(null, file);
	}

	function fileDecodedCallback(err, audioBuffer){
		if (err){
			console.error(err);
			return; // return Rejected Promise
		}

		console.log('Load/decod complete');

		var numCh_ = audioBuffer.numberOfChannels;
		var numFrames_ = audioBuffer.length*targetSampleRate/audioBuffer.sampleRate;

		var offlineContext_ = new OfflineAudioContext(numCh_, numFrames_, targetSampleRate);
		var bufferSource_ = offlineContext_.createBufferSource();
		bufferSource_.buffer = audioBuffer;

		offlineContext_.oncomplete = function(event){
			var resampeledBuffer = event.renderedBuffer;
			console.log('Done Rendering');
			if (typeof oncomplete === 'function'){
				oncomplete({
					getAudioBuffer: function(){
						return resampeledBuffer;
					},
					getFile : function (fileCallback){
						encoder.encodeWAV([resampeledBuffer.getChannelData(0), resampeledBuffer.getChannelData(1)],
							resampeledBuffer.sampleRate,
							function(blob) {
								console.log('wav encoding complete: ', blob );
								if (blob) {
									fileCallback(URL.createObjectURL(blob));
								}
							});
					}
				});
			}
		};

		console.log('Starting Offline Rendering');
		bufferSource_.connect(offlineContext_.destination);
		bufferSource_.start(0);
		offlineContext_.startRendering();
	}
}


module.exports = resampler;
