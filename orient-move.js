// let playWhenMove = (event) => {
//     playSource.gain.value = Math.abs(event.beta * 360 / Math.PI);
// }
// initDevice({orientation: playWhenMove})
let volumeAndRate = () => {
    if (playSource) {
        playSource.gain.value = pos.x * 2 / width + 1;
        playSource.playbackRate.value = pos.y * 2 / height + 1;
    }
}

let filterEffect = () => {

    if (playSource) {
        playSource.lfo.frequency.value = (pos.x / width + 0.5) * 15 + 0;
        //playSource.lfoGain.gain.value =  (pos.y / height + 0.5) * 400;
        playSource.filter.Q.value = (pos.y / height + 0.5) * 10 + 0.0001;
        //playSource.filter.Q.value  = orientation.z * 200 / 360 + 0.0001;
    }
}



const modeButton = document.getElementById('mode');
modeButton.playEffect = volumeAndRate;
modeButton.addEventListener('click', function() {
    if (modeButton.innerText == 'Mode 1') {
        modeButton.innerText = 'Mode 2';
        modeButton.setAttribute('class','btn btn-block btn-dark btn-lg');
        this.playEffect = filterEffect;
        playSource.gain.value = 1;
        playSource.playbackRate.value = 1;
    } else {
        modeButton.innerText = 'Mode 1';
        modeButton.setAttribute('class','btn btn-block btn-light btn-lg');
        this.playEffect = volumeAndRate;
        playSource.lfo.frequency.value = 0;
        playSource.lfoGain.gain.value = 1;
        playSource.filter.frequency.value = 10000;
    }

});

let multi = {
    x: 10,
    y: 10,
    z: 5
}

let pos = {
    x: 0,
    y: 0,
}

function setup() {
    createCanvas(window.innerWidth, 300);
}

function draw() {
    background(0, 0, 0);
    textSize(32);
    push()
        fill(100);
        pos.x += sin(radians(orientation.y))*multi.y;
        pos.x = max(-width/2+25, min(width/2-25, pos.x));

        pos.y += sin(radians(orientation.x))*multi.x;
        pos.y = max(-height/2+25, min(height/2-25, pos.y));

        modeButton.playEffect();
        
        translate(width / 2 + pos.x, height / 2 + pos.y);
        rotate(radians(-orientation.z)* multi.z);
        //square(0 , 0, 50);
        square(-25, -25, 50);
    pop()

    fill(255);
    
    text(acc.x.toFixed(1) + ", " + acc.y.toFixed(1) + ", " + acc.z.toFixed(1), 3, 50)
    text(orientation.x.toFixed(1) + ", " + orientation.y.toFixed(1) + ", " + orientation.z.toFixed(1), 3, 90)
    text(pos.x.toFixed(1) + ", "+ pos.y.toFixed(1), 3, 120);

}