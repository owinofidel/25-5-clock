// getting all the elements from the HTML 
let timeLeft = document.getElementById('time-left')
let label = document.getElementById('timer-label')
const session = document.getElementById("session-length")
const restValue = document.getElementById("break-length")
const sessionIncrement = document.getElementById('session-increment')
const sessionDecrement = document.getElementById('session-decrement')
const restIncrement = document.getElementById('break-increment')
const restDecrement = document.getElementById('break-decrement')
const playPause = document.getElementById('start_stop')
const reset = document.getElementById('reset')
const audio = document.getElementById("beep")
let timer = document.getElementById("timer").classList

let restTime =`${Number(restValue.textContent)}`
let sessionTime = `${Number(session.textContent)}`

let toggle = false

timeLeft.innerHTML = `${sessionTime}:00`

//removes the event listeners from the incrementor, decrementor buttons

const toggleOff = () => {
    if(toggle){
        restIncrement.removeEventListener("click" ,restIncrementFunction)
        restDecrement.removeEventListener('click', restDecrementFunction)
        sessionIncrement.removeEventListener('click', sessionIncrementFunction)
        sessionDecrement.removeEventListener('click', sessionDecrementFunction)
    }
}

// adds the event listeners to the incrementor and decrementor buttons

const toggleOn = () => {
    if(!toggle){
        restIncrement.addEventListener("click" ,restIncrementFunction)
        restDecrement.addEventListener('click', restDecrementFunction)
        sessionIncrement.addEventListener('click', sessionIncrementFunction)
        sessionDecrement.addEventListener('click', sessionDecrementFunction)
    }
}

// increases the length of the rest session

const restIncrementFunction = () => {
    if(restTime > 0 && restTime < 60){
        restTime = restTime + 1;
        restValue.innerHTML = restTime
        return 
    } else {
        return
    }
}

// decreases the length of the rest session

const restDecrementFunction = () => {
    if(restTime > 1 && restTime <= 60){
        restTime = restTime - 1;
        restValue.innerHTML = restTime
        return 
    } else {
        return
    }
}

// increases the session length 

const sessionIncrementFunction = () => {
    if(sessionTime > 0 && sessionTime < 60){
        sessionTime += 1
        timeLeft.innerHTML = sessionTime < 10 ? `0${sessionTime}:00` : `${sessionTime}:00`
        session.innerHTML = sessionTime
        return 
    } else {
        return
    }
}

// decreases the session period

const sessionDecrementFunction = () => {
        if(sessionTime > 1 && sessionTime <= 60){
            sessionTime -= 1
            timeLeft.innerHTML = sessionTime < 10 ? `0${sessionTime}:00`:`${sessionTime}:00`
            session.innerHTML = sessionTime
            return 
        } else{
            return
        }
}


const counter = (countDownDate, session) => {
        // Get today's date and time
        var now = new Date().getTime();
            
        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
        // Output the result in an element with id="demo"
        if(seconds < 10 ){
            timeLeft.innerHTML = minutes < 10 ? `0${minutes}:0${seconds}` : `${minutes}:0${seconds}`
        }
        else{
            timeLeft.innerHTML = minutes < 10 ? `0${minutes}:${seconds}` : `${minutes}:${seconds}`
        }

        // if there are less than five minutes on the countdown the color changes to a shade of red

        if(distance <= 300000){
            timer.add("danger")
        }else{
            timer.remove("danger")
        }


        // If the count down is over, write some text 
        if (distance < 100) {
            session === 'session' ? session = 'pause' : session = 'session'

            if(session === 'pause'){
                timer.remove('danger')
                clearInterval(intervalId)
                audio.play()
                label.textContent = 'Break'
                timeLeft.innerHTML = restTime < 10 ? `0${restTime}:00` : `${restTime}:00`

                setTimeout(()=>{
                    countDownDate = new Date().getTime() + (restTime * 60 * 1000)
                    sessionTime = restTime
                    intervalId = setInterval(counter, 100, countDownDate, session)
                }, 2000)
            } else {
                timer.remove('danger')
                clearInterval(intervalId)
                audio.play()
                label.textContent = 'Session'
                timeLeft.innerHTML = sessionTime < 10 ? `0${sessionTime}:00` : `${sessionTime}:00`

                setTimeout(()=>{
                    countDownDate = new Date().getTime() + (sessionTime * 60 * 1000)
                    sessionTime = sessionTime
                    intervalId = setInterval(counter, 100, countDownDate, session)
                }, 2000)
            }
        }
}


let intervalId;

function startTimer(input){
    let session = "session"

    var countDownDate = new Date().getTime() + input;

    if(!intervalId){
        intervalId = setInterval(counter, 100, countDownDate, session);
    }
}

function stopTimer(){
    clearInterval(intervalId)
    intervalId = null
}

// handles all the changes that should occur once the play / plause button is clicked


const playPauseFunction = () => {
    toggle = !toggle
    toggleOn()
    toggleOff()
   
    let countdownTimeLeft = timeLeft.innerHTML.split(":")
    let minutes =  parseInt(countdownTimeLeft[0])
    let seconds =  parseInt(countdownTimeLeft[1])
    let time = (minutes * 60 * 1000) + (seconds * 1000)   
    toggle ? startTimer(time) : stopTimer()
     
}

// resets or rather puts the apps elements back to their default values

const resetFunction = () => {
    label.textContent = "Session"
    timer.remove("danger")
    toggle = false
    stopTimer()
    toggleOn()
    toggleOff()
    audio.load()
    sessionTime = 25
    restTime = 5
    session.innerHTML = sessionTime
    restValue.innerHTML = restTime
    timeLeft.innerHTML = `${sessionTime}:00` 
}




restIncrement.addEventListener("click" ,restIncrementFunction)
restDecrement.addEventListener('click', restDecrementFunction)
sessionIncrement.addEventListener('click', sessionIncrementFunction)
sessionDecrement.addEventListener('click', sessionDecrementFunction)
playPause.addEventListener('click', playPauseFunction)
reset.addEventListener('click', resetFunction)
