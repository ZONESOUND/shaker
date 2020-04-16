let playWhenAcc = (event) => {
    if (event.acceleration.y > 2) {
        playImmediately();
    }
}

initDevice({motion: playWhenAcc})


function playImmediately() {
    if (config.enable) {
        console.log(recordedChunks);
        playBuffer(recordedChunks);
        config.enable = false;
        setTimeout(()=>{
            config.enable = true;
        }, config.enableMs)
    }
}



function setup() {
    createCanvas(window.innerWidth, 200);
}

function draw() {
    background(255);
    textSize(32);
    text(acc.x.toFixed(1) + ", " + acc.y.toFixed(1) + ", " + acc.z.toFixed(1), 3, 50)
    text(orientation.x.toFixed(1) + ", " + orientation.y.toFixed(1) + ", " + orientation.z.toFixed(1), 3, 90)

}