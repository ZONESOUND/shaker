// let playWhenMove = (event) => {
//     playSource.gain.value = Math.abs(event.beta * 360 / Math.PI);
// }
// initDevice({orientation: playWhenMove})



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

        if (playSource) {
            playSource.gain.value = pos.x * 2 / width + 1;
            playSource.playbackRate.value = pos.y * 2 / height + 1;
        }
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