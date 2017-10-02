const getParamsFromInputs = () => {
	const noOfSessions = document.getElementById('sessions').value;
	const minutesPerPomodoro = document.getElementById('minutes-per-pomodoro').value;
	const minutesPerBreak = document.getElementById('minutes-per-break').value;
	return { noOfSessions, minutesPerPomodoro, minutesPerBreak };
};

let clock = null;

const createClock = () => {
	const { noOfSessions, minutesPerPomodoro, minutesPerBreak } = getParamsFromInputs();
	return new PomodoroClock( // eslint-disable-line no-undef
		minutesPerPomodoro,
		minutesPerBreak,
		noOfSessions,
		(state, clockInfo) => {
			const progressType = state.pomodoroInProgress ? 'Pomodoro' : 'Break';
			const allSessionsCompleted = state.elapsedSessions === clockInfo.noOfSessions;
			//document.getElementById('timer').innerHTML =
			//	`Clock (${allSessionsCompleted ? 'Finished' : progressType}): ${state.elapsedProgressInSeconds} Finished Sessions: ${state.elapsedSessions}/${clockInfo.noOfSessions}`;
			document.getElementById('clock-type').innerHTML = 
				`Clock (${allSessionsCompleted ? 'Finished' : progressType})`;
			document.getElementById('clock-timer').innerHTML = 
				`${state.elapsedProgressInSeconds}`;	
			document.getElementById('finished-session-display').innerHTML = 
				`Finished Sessions: ${state.elapsedSessions}/${clockInfo.noOfSessions}`;
			if(allSessionsCompleted) {
				document.getElementById('pause-button').style.display = 'none';
			}
		}
	);
};

const startControl = () => {
	clock = createClock();
	showClock();
	clock.startSession();
};

const pauseControl = () => {
	if (clock.isPaused()) {
		clock.resume();
		document.getElementById('pause-button').innerHTML = 'Pause';
	} else {
		clock.pause();
		document.getElementById('pause-button').innerHTML = 'Resume';
	}
};

const resetControl = () => {
	clock.reset();
	document.getElementById('pause-button').innerHTML = 'Pause';
	clock = null;
	hideClock();
};

const addEventListeners = () => {
	document.getElementById('start-button').addEventListener('click', startControl);
	document.getElementById('pause-button').addEventListener('click', pauseControl);
	document.getElementById('reset-button').addEventListener('click', resetControl);
};

const hideClock = () => {
	document.getElementById('pomodoro-clock').style.display = 'none';
	document.getElementById('pause-button').disabled = true;
	document.getElementById('reset-button').disabled = true;

	document.getElementById('input-controls').style.display = 'block';
	document.getElementById('start-button').disabled = false;
	document.getElementById('sessions').disabled = false;
	document.getElementById('minutes-per-pomodoro').disabled = false;
	document.getElementById('minutes-per-break').disabled = false;
};

const showClock = () => {
	document.getElementById('pomodoro-clock').style.display = 'block';
	document.getElementById('pause-button').disabled = false;
	document.getElementById('reset-button').disabled = false;

	document.getElementById('input-controls').style.display = 'none';
	document.getElementById('start-button').disabled = true;
	document.getElementById('sessions').disabled = true;
	document.getElementById('minutes-per-pomodoro').disabled = true;
	document.getElementById('minutes-per-break').disabled = true;
};

addEventListeners();
