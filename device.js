let config = {
    accThres : 2,
    enableMs: 20,
    enable: true
}
const startButton = document.getElementById('start');
const workspace = document.getElementById('workspace');
startButton.addEventListener('click', function() {
    grantMicPermission();
    workspace.setAttribute('class', '');
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS 13+
            DeviceOrientationEvent.requestPermission()
            .then(response => {
            if (response == 'granted') {
                addDeviceEvent();
            }}).catch(console.error)
        
        } else {
            // non iOS 13+
            addDeviceEvent();
        }
    }
    
})

function addDeviceEvent() {
// Set up device orientation event here
    //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handleOrientation, false);
    } else {
        alert('DeviceOrientationEvent is not supported!');
        console.log("DeviceOrientationEvent is not supported");
    }
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", handleMotion, true);
    }
    startButton.parentNode.removeChild(startButton);
    //}
}


let acc = {x:-1, y:-1, z:-1}
let orientation = {x:-1, y:-1, z:-1}
let dispatchOrientation;
let dispatchMotion;

function initDevice({orientation, motion}) {
    if (orientation) dispatchOrientation = orientation;
    if (motion) dispatchMotion = motion;
}

/*
    EVENT USAGE
    event.alpha: z (0~360) z 軸射出螢幕
    event.beta: x (-180~180) x 軸左右
    event.gamma: y (-90~90) y 軸上下
    More Info: 
    https://developer.mozilla.org/zh-TW/docs/Web/API/Detecting_device_orientation
    https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained
*/
function handleOrientation(event) {
    orientation = {
        x: event.beta,
        y: event.gamma,
        z: event.alpha
    }
}

/*
    EVENT USAGE
    event.acceleration: includes x, y, z
    event.accelerationIncludingGravity: includes x, y, z
    event.rotationRate: includes alpha(z), beta(x), gamma(y)
    event.interval: 裝置取得資料的頻率
*/
function handleMotion(event) {
    acc = {
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z,
    }
    if (dispatchMotion) dispatchMotion(event);
    //acc = event.acceleration;
}
