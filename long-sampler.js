let AudioContext = window.AudioContext|| window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
let context = new AudioContext();
const player = document.getElementById('player');
const recordButton = document.getElementById('record');
const playButton = document.getElementById('play');
recordButton.state = 'stop';
playButton.state = 'stop';
var recordedChunks = []
var playSource;
var source;
var processor;
//const gainNode = context.createGain();
// gainNode.gain.value = 1;

var handleSuccess = function(stream) {
    source = context.createMediaStreamSource(stream);
    processor = context.createScriptProcessor(1024,1,1);
    source.connect(processor);
    processor.connect(context.destination);
    
    processor.onaudioprocess = function(e){
        if (recordButton.state != 'record') return;
        //console.log(e.inputBuffer.getChannelData(0));
        e.inputBuffer.getChannelData(0).forEach(e => {
            recordedChunks.push(e)
        })
    };
    recordButton.addEventListener('click', function() {
        if (this.state == 'stop') { // to record
            recordedChunks = [];
            recordButton.setAttribute('class', 'btn btn-block btn-danger btn-lg');
            recordButton.innerText = this.state;
            this.state = 'record';
        } else { // to stop!
            recordButton.setAttribute('class', 'btn btn-block btn-success btn-lg');
            recordButton.innerText = this.state;
            this.state = 'stop';
        }
    });

    playButton.addEventListener('click', function() {
        if (this.state == 'stop') { 
            playButton.setAttribute('class', 'btn btn-block btn-danger btn-lg');
            playButton.innerText = this.state;
            this.state = 'play';
        } else {
            playButton.setAttribute('class', 'btn btn-block btn-primary btn-lg');
            playButton.innerText = this.state;
            this.state = 'stop';
            playSource.stop();
        }
        playBuffer(recordedChunks);
    });
};

function playBuffer( buffers ) {
	
	playSource = context.createBufferSource();
	let newBuffer = context.createBuffer(1, buffers.length, context.sampleRate );
    newBuffer.getChannelData(0).set(buffers);
    
    let lfo = context.createOscillator();
    let lfoGain = context.createGain();
    var biquadFilter = context.createBiquadFilter();
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.value = 440;
    biquadFilter.gain.value = 25;

    lfo.type = lfo.SINE;

    lfo.frequency.value = 3;
    lfoGain.gain.value = 400;
    playSource.filter = biquadFilter;
    playSource.lfo = lfo;
    playSource.lfoGain = lfoGain;
    playSource.buffer = newBuffer;
    playSource.gain = context.createGain();
    playSource.loop = true;
    playSource.connect(biquadFilter);
    biquadFilter.connect(context.destination);
    //oscGain.connect(playSource.gain);
    playSource.start();

    lfo.connect(lfoGain)
    lfoGain.connect(biquadFilter.frequency);
    lfo.start();

    playSource.onended = function() {
        playSource.disconnect();
    }
}

let grantMicPermission = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess)
}
