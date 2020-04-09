//init web audio context
let AudioContext = window.AudioContext|| window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
let context = new AudioContext();
let recorder;
let node = context.createJavaScriptNode || context.createScriptProcessor();
let source;
console.log(context.sampleRate);
//get document element
const downloadLink = document.getElementById('download');
const stopButton = document.getElementById('stop');
const startButton = document.getElementById('start');
const playButton = document.getElementById('play');
const audio = document.getElementById('player');

const track = context.createMediaElementSource(audio);
const gainNode = context.createGain();
track.connect(context.destination);
//connect(gainNode).
const volumeControl = document.querySelector('#volume');

volumeControl.addEventListener('input', function() {
    gainNode.gain.value = this.value;
    console.log(this.value);
}, false);

startButton.addEventListener('click', function() {
	alert('start!');
	console.log("recorder started");
	recorder.record();
	//mediaRecorder.start();
	//console.log(mediaRecorder.state);

   
	
})

playButton.state = 'stop';
playButton.addEventListener('click', function() {
	alert('play');
	if (this.state == 'play'){
		this.state = 'stop';
		audio.pause();
	} else {
		this.state = 'play';
		audio.play();
	}
		
})

audio.addEventListener('ended', () => {
    playButton.state = 'stop';
}, false);

let audioToLink = (blob) => {
	console.log('audio To Link', blob);
	downloadLink.href = URL.createObjectURL(blob);
	//downloadLink.download = 'acetest.wav';
	audio.src = downloadLink.href;
	//recorder.getBuffer(getBufferCallback);
}

function getBufferCallback( buffers ) {
	//return;
	//alert('getBuffer');
	console.log(buffers[0].length, context.sampleRate);
	// const offlineAudioContext = new OfflineAudioContext(
	// 	{ length: buffers[0].length, sampleRate: 32000 }
	// );
	// const audioBufferSourceNode = new AudioBufferSourceNode(
	// 	offlineAudioContext,
	// 	{ buffer: buffers }
	// );
	
	//audioBufferSourceNode.start(0);
	//audioBufferSourceNode.connect(offlineAudioContext.destination);
	
	// const resampledAudioBuffer = await offlineAudioContext.startRendering();
	// buffers = resampledAudioBuffer;

	var newSource = context.createBufferSource();
	var newBuffer = context.createBuffer( 2, buffers[0].length, context.sampleRate );
	//var newBuffer = context.createBuffer( 2, buffers[0].length, context.sampleRate );

	newBuffer.getChannelData(0).set(buffers[0]);
	newBuffer.getChannelData(1).set(buffers[1]);
	newSource.buffer = newBuffer;
	newSource.connect(context.destination);
	newSource.start(0);
}

function playBuffer( buffers ) {
	//return;
	//alert('getBuffer');
	console.log(buffers.length, context.sampleRate);
	// const offlineAudioContext = new OfflineAudioContext(
	// 	{ length: buffers[0].length, sampleRate: 32000 }
	// );
	// const audioBufferSourceNode = new AudioBufferSourceNode(
	// 	offlineAudioContext,
	// 	{ buffer: buffers }
	// );
	
	//audioBufferSourceNode.start(0);
	//audioBufferSourceNode.connect(offlineAudioContext.destination);
	
	// const resampledAudioBuffer = await offlineAudioContext.startRendering();
	// buffers = resampledAudioBuffer;

	var newSource = context.createBufferSource();
	var newBuffer = context.createBuffer( 2, buffers.length, context.sampleRate );
	//var newBuffer = context.createBuffer( 2, buffers[0].length, context.sampleRate );

	newBuffer.getChannelData(0).set(buffers);
	newBuffer.getChannelData(1).set(buffers);
	newSource.buffer = newBuffer;
	newSource.connect(context.destination);
	newSource.start(0);
}

let handleMic = (stream) => {
	let input = context.createMediaStreamSource(stream);
	recorder = new Recorder(input);
	// Create a source from our MediaStream
	const recordedChunks = [];
	source = context.createMediaStreamSource(stream);
	node.onaudioprocess = function(data) {
		var leftChannel = data.inputBuffer.getChannelData(0).buffer;
		var rightChannel = data.inputBuffer.getChannelData(1).buffer;
		recordedChunks.push(leftChannel);
	}
	 // Connect the microphone to the script processor
	 source.connect(node);
	 node.connect(context.destination);

	stopButton.addEventListener('click', function() {
		alert('stop!');
		console.log('button stop!');
		recorder.stop();
		recorder.exportWAV(audioToLink);
		//mediaRecorder.stop();
		node.disconnect();
		source.disconnect();
		playBuffer(recordedChunks);
		// downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
		// downloadLink.download = 'acetest.wav';
		//audio.src = downloadLink.href;
		//recorderChunks = [];
		//playSound(recordedChunks);
		// context.decodeAudioData(recordedChunks, function(buffer) {
		// 	source.buffer = buffer;
	
		// 	source.connect(context.destination);
		// 	source.loop = true;
		// },
	
		// function(e){ console.log("Error with decoding audio data" + e.err); });
	
	})

	// const options = {mimeType: 'video/webm;codecs=vp9'};
	// const recordedChunks = [];
	// mediaRecorder = new MediaRecorder(stream, options);  
  
	// mediaRecorder.addEventListener('dataavailable', function(e) {
	// 	if (e.data.size > 0) {
    // 		recordedChunks.push(e.data);
    // 	}
	// });

	// mediaRecorder.addEventListener('stop', function() {
	// 	downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
	// 	downloadLink.download = 'acetest.wav';
	// 	audio.src = downloadLink.href;
	// 	recorderChunks = [];
	// });

}

let micError = (e) => {
	alert(e);
	alert('Refresh Page And Allow Page To Use Your Microphone.');
}

function startMic() {
	// navigator.getUserMedia = ( 
	// 	navigator.mediaDevices.getUserMedia ||
	// 	//navigator.getUserMedia ||
	// 	navigator.webkitGetUserMedia ||
	// 	navigator.mozGetUserMedia ||
	// 	navigator.msGetUserMedia );
	navigator.mediaDevices.getUserMedia({audio: true}).then(handleMic, micError);
}

function setup() {
	//createCanvas(canvasW, canvasH);
	startMic();
}

function playSound2(buffer) {
	var source = context.createBufferSource(); // creates a sound source
	source.buffer = buffer;                    // tell the source which sound to play
	source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	source.start(0);                           // play the source now
											   // note: on older systems, may have to use deprecated noteOn(time);
  }

function playSound( raw ) {
	// i'll assume you know how to convert in this direction
	// since you have convertFloat32ToInt16
	var buffer = convertInt16ToFloat32( raw ),
	  src = context.createBufferSource(),
	  audioBuffer = context.createBuffer( 1, buffer.length, context.sampleRate );
	audioBuffer.getChannelData( 0 ).set( buffer );
	src.buffer = audioBuffer;
	src.connect(context.destination);
	src.start(0);
  }