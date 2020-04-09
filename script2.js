let AudioContext = window.AudioContext|| window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
let context = new AudioContext();
const player = document.getElementById('player');
const recordButton = document.getElementById('record');
const playButton = document.getElementById('play');
recordButton.state = 'stop';
var recordedChunks = []
var playSource;
var source;
var processor;

var handleSuccess = function(stream) {
    source = context.createMediaStreamSource(stream);
    processor = context.createScriptProcessor(1024,1,1);
    processor.onaudioprocess = function(e){
        console.log(e.inputBuffer.getChannelData(0));
        e.inputBuffer.getChannelData(0).forEach(e => {
            recordedChunks.push(e)
        })
    };
    recordButton.addEventListener('click', function() {
        if (this.state == 'stop') {
            recordedChunks = [];
            // if (playSource) {
            //     console.log('disconnect');
            //     playSource.stop();
            //     playSource.disconnect();
            //     playSource = undefined;
            // }
            
            
            source.connect(processor);
            processor.connect(context.destination);
            recordButton.setAttribute('class', 'btn btn-block btn-danger btn-lg');
            recordButton.innerText = this.state;
            this.state = 'record';
        } else {
            source.disconnect();
            processor.disconnect(); 
            recordButton.setAttribute('class', 'btn btn-block btn-success btn-lg');
            recordButton.innerText = this.state;
            this.state = 'stop';
            //playBuffer(context, recordedChunks);
            
        }
    });

    playButton.addEventListener('click', function() {
        playBuffer(recordedChunks);
    });
};

function playBuffer( buffers ) {
	
	playSource = context.createBufferSource();
	let newBuffer = context.createBuffer(1, buffers.length, context.sampleRate );
	newBuffer.getChannelData(0).set(buffers);
	//newBuffer.getChannelData(1).set(buffers);
	playSource.buffer = newBuffer;
	playSource.connect(context.destination);
    playSource.start();
}

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess)