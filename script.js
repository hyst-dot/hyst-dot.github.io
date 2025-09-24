let speedAmp = 1;
let clockTime = new Date(); 
let lastUpdateTime = Date.now(); 
let hasTriggered = false;

const clockElement = document.getElementById('clock');
const clickSound = new Audio('sounds/click.mp3')

const triggerHour = 0;
const triggerMinute = 0;
const triggerSecond = 0;

function getNextTriggerTime(reference) {
    const next = new Date(reference);
    next.setHours(triggerHour, triggerMinute, triggerSecond, 0);
    if (next <= reference) {
        next.setDate(next.getDate() + 1);
    }
    return next;
}

let targetTime = getNextTriggerTime(clockTime);
let previousClockTime = new Date(clockTime);

function updateClock() {
    const now = Date.now();
    const realDelta = now - lastUpdateTime; 
    lastUpdateTime = now;

    const acceleratedDelta = realDelta * speedAmp;
    clockTime = new Date(clockTime.getTime() + acceleratedDelta);

    const hours = String(clockTime.getHours()).padStart(2, '0');
    const minutes = String(clockTime.getMinutes()).padStart(2, '0');
    const seconds = String(clockTime.getSeconds()).padStart(2, '0');

    if (!hasTriggered && previousClockTime < targetTime && clockTime >= targetTime) {
        hasTriggered = true;
        speedAmp = 0;
        triggerEvent();

        targetTime = getNextTriggerTime(clockTime);
        hasTriggered = false;
    }

    previousClockTime = new Date(clockTime);

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;

    requestAnimationFrame(updateClock);
}

document.getElementById('play').addEventListener('click', () => {
    clickSound.play();
    speedAmp = 3000; 
});

document.getElementById('stop').addEventListener('click', () => {
    speedAmp = 1; 
});

function triggerEvent(){
    if(confirm('The time is now!')){
        window.location.href = 'maze.html'
    } else{}

}

updateClock();