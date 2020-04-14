initDevice({motion: playWhenAcc})

let playWhenAcc = (event) => {
    if (event.acceleration.y > 2) {
        playImmediately();
    }
}

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