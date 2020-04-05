
//init web audio context
let AudioContext = window.AudioContext||window.webkitAudioContext;
let context = new AudioContext();
let mediaRecorder;

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


stopButton.addEventListener('click', function() {
	alert('stop!');
	console.log('button stop!');
	mediaRecorder.stop();
})

startButton.addEventListener('click', function() {
	alert('start!');
	console.log("recorder started");
	mediaRecorder.start();
	console.log(mediaRecorder.state);
    
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

let handleMic = (stream) => {
  
	const options = {mimeType: 'video/webm;codecs=vp9'};
	const recordedChunks = [];
	mediaRecorder = new MediaRecorder(stream, options);  
  
	mediaRecorder.addEventListener('dataavailable', function(e) {
		if (e.data.size > 0) {
    		recordedChunks.push(e.data);
    	}
	});

	mediaRecorder.addEventListener('stop', function() {
		downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
		downloadLink.download = 'acetest.wav';
		audio.src = downloadLink.href;
		recorderChunks = [];
	});

}

let micError = (e) => {
	alert(e);
	alert('Refresh Page And Allow Page To Use Your Microphone.');
}

function startMic() {
	navigator.getUserMedia = ( 
		navigator.mediaDevices.getUserMedia ||
		//navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia );
	navigator.getUserMedia({audio: true}).then(handleMic, micError);
}

function setup() {
	//createCanvas(canvasW, canvasH);
	startMic();
}