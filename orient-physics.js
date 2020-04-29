let multi = {
    x: 10,
    y: 10,
    z: 5
}
let shake = false;
let orient2Grav = (event) => {
   // playSource.gain.value = Math.abs(event.beta * 360 / Math.PI);
   //console.log(event);
   ballPool.setGravity(getGravityXY())
}
let motion2Force = (event) => {
    if (Math.abs(event.acceleration.y) > 3 && !shake) {
        ballPool.applyForce({x:event.acceleration.y/40, y:0})
        shake = true
        setTimeout(function() {
            shake = false;
        }, 1000)
    }
        
}
initDevice({orientation: orient2Grav, motion: motion2Force})

function getGravityXY() {
    //console.log(Math.sin(deg2rad(orientation.y)), Math.sin(deg2rad(orientation.x)));
    let mul = 1.5;
    return {x: Math.sin(mulRad(deg2rad(orientation.y), mul, Math.PI)), 
            y: Math.sin(mulRad(deg2rad(orientation.x), mul, Math.PI))};
}

function deg2rad(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}

function mulRad(rad, mul, maxNum) {
    return Math.min(rad*mul, maxNum);
}
