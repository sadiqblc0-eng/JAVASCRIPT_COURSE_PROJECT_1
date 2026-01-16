/* ===== STATE ===== */
const state = {
  started: false,
  timer: null,
  soundOn: true,   // true = sound chalegi
  zone: "Asia/Karachi",
  alarm: null,
};

/* ===== ELEMENTS ===== */
const clockEle = document.querySelector(".clock");
const startBtn = document.getElementById("start");
const soundBtn = document.getElementById("Sound");
const themeBtn = document.getElementById("theme");
const timezoneSel = document.getElementById("timezone");
const alarmInput = document.getElementById("alarmTime");
const setAlarmBtn = document.getElementById("setAlarm");

const tick = document.getElementById("tick");
const alarmSound = document.getElementById("alarmSound");

/* ===== LOAD TIMEZONES ===== */
Intl.supportedValuesOf("timeZone").forEach(z => {
  const opt = document.createElement("option");
  opt.value = z;
  opt.textContent = z;
  timezoneSel.appendChild(opt);
});
timezoneSel.value = state.zone;

/* ===== AUDIO UNLOCK ===== */
function unlockAudio(){
  tick.volume = 0.4;
  alarmSound.volume = 1;

  tick.play().then(()=>{
    tick.pause();
    tick.currentTime = 0;
  }).catch(()=>{});

  alarmSound.play().then(()=>{
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }).catch(()=>{});
}

/* ===== CLOCK ===== */
function updateClock(){
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: state.zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);

  clockEle.textContent = time;

  /* 🔊 TICK SOUND */
  if(state.soundOn){
    tick.currentTime = 0;
    tick.play().catch(()=>{});
  }

  /* ⏰ ALARM */
  if(state.alarm && time.slice(0,5) === state.alarm){
    alarmSound.currentTime = 0;
    alarmSound.play();
    alert("⏰ ALARM!");
    state.alarm = null;
  }
}

/* ===== START / PAUSE ===== */
startBtn.onclick = () => {
  unlockAudio();

  if(!state.started){
    updateClock();
    state.timer = setInterval(updateClock, 1000);
    startBtn.textContent = "Pause ⏸";
  }else{
    clearInterval(state.timer);
    startBtn.textContent = "Resume ▶️";
  }
  state.started = !state.started;
};

/* ===== 🔇 MUTE / UNMUTE (FIXED) ===== */
soundBtn.onclick = () => {
  state.soundOn = !state.soundOn;

  if(state.soundOn){
    soundBtn.textContent = "Mute 🔇";   // sound ON
  }else{
    soundBtn.textContent = "Unmute 🔊"; // sound OFF
    tick.pause();                       // فوراً band
    tick.currentTime = 0;
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
};

/* ===== THEME ===== */
themeBtn.onclick = () => {
  document.body.classList.toggle("light");
};

/* ===== TIMEZONE ===== */
timezoneSel.onchange = () => {
  state.zone = timezoneSel.value;
};

/* ===== ALARM ===== */
setAlarmBtn.onclick = () => {
  if(alarmInput.value){
    state.alarm = alarmInput.value;
    alert("Alarm set for " + state.alarm);
  }
};