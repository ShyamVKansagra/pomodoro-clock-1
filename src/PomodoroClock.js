class PomodoroClock { // eslint-disable-line no-unused-vars
	constructor(
		sessionLengthInMinutes,
		breakLengthInMinutes,
		noOfSessions = 1,
		renderFn = console.log // eslint-disable-line no-console
	) {
		this.sessionLengthInSeconds = parseFloat(sessionLengthInMinutes) * 60;
		this.breakLengthInSeconds = parseFloat(breakLengthInMinutes) * 60;
		this.noOfSessions = parseInt(noOfSessions);

		this.initialState = {
			pomodoroInProgress: false,
			breakInProgress: false,
			elapsedProgressInSeconds: 0,
			elapsedSessions: 0,
			pause: false,
		};
		this.state = this.initialState;

		this.setState = (state) => {
			this.state = Object.assign({}, this.state, state);
			const clockInfo = {
				sessionLengthInSeconds: this.sessionLengthInSeconds,
				breakLengthInSeconds: this.breakLengthInSeconds,
				noOfSessions: this.noOfSessions
			};
			renderFn(this.state, clockInfo);
		};

		this.timer = null;

		this.updateElapsedTime = (
			startTime,
			stateProperty,
			totalLengthInSeconds,
			progressInSeconds
		) => {
			const elapsedProgressInSeconds = progressInSeconds + (
				(Date.now() - startTime) / 1000
			);
			const inProgress = elapsedProgressInSeconds < totalLengthInSeconds;
			if (!this.state.pause) {
				if (inProgress) {
					this.setState({
						elapsedProgressInSeconds,
						[stateProperty]: true
					});
					this.timer = setTimeout(
						() => this.updateElapsedTime(
							startTime,
							stateProperty,
							totalLengthInSeconds,
							progressInSeconds
						),
						100
					);
				} else {
					this.setState({
						elapsedProgressInSeconds: 0,
						[stateProperty]: false,
						elapsedSessions: stateProperty === 'breakInProgress'
							? this.state.elapsedSessions + 1
							: this.state.elapsedSessions
					});
					stateProperty === 'breakInProgress'
						? (this.canStartAnotherSession() && this.startSession())
						: this.startBreak();
				}
			}
		};

		this.startSession = (progressInSeconds = 0, startTime = Date.now()) => {
			this.setState({ pomodoroInProgress: true });
			setTimeout(
				() => this.updateElapsedTime(
					startTime,
					'pomodoroInProgress',
					this.sessionLengthInSeconds,
					progressInSeconds
				),
				100
			);
			// this.playSessionEndAudio();
		};

		this.startBreak = (progressInSeconds = 0, startTime = Date.now()) => {
			this.setState({ breakInProgress: true });
			setTimeout(
				() => this.updateElapsedTime(
					startTime,
					'breakInProgress',
					this.breakLengthInSeconds,
					progressInSeconds
				),
				100
			);
			// this.playBreakEndAudio();
		};

		this.pause = () => this.setState({ pause: true });
		this.resume = () => {
			this.setState({ pause: false });
			if (this.state.pomodoroInProgress) {
				this.startSession(this.state.elapsedProgressInSeconds);
			} else if (this.state.breakInProgress) {
				this.startBreak(this.state.elapsedProgressInSeconds);
			}
		};
		this.reset = () => {
			clearTimeout(this.timer);
			this.setState(this.initialState);
		};
		this.canStartAnotherSession = () => this.state.elapsedSessions < this.noOfSessions;
		this.isPaused = () => this.state.pause;

		this.convertIntoCountDownTime = () => {
			const progressType = this.state.pomodoroInProgress ? 'Pomodoro' : 'Break'
			const totalTime = progressType === 'Pomodoro' ? 
			this.sessionLengthInSeconds : this.breakLengthInSeconds;

			if (!(this.noOfSessions === this.state.elapsedSessions)) {
				return getCountDownTime(totalTime, this.state.elapsedProgressInSeconds);
			}
		}

		const getCountDownTime = (
			totalTime, 
			elapsedProgressInSeconds
		) => {
			const remainingTime = parseInt(totalTime - elapsedProgressInSeconds);
			let remainingTimeMinutes = remainingTime / 60;
			let remainingTimeSeconds = remainingTime % 60;

			if (parseInt(remainingTimeMinutes) < 10) {
				remainingTimeMinutes = `0${parseInt(remainingTimeMinutes)}`;	
			}

			if (parseInt(remainingTimeSeconds) < 10) {
				remainingTimeSeconds = `0${parseInt(remainingTimeSeconds)}`;
			}

			return `${remainingTimeMinutes}:${remainingTimeSeconds}`;
		}
	}
}
