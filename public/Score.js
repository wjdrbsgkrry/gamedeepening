import { sendEvent } from './Sockets.js';

class Score {
	score = 0;
	itemScore = 0;
	HIGH_SCORE_KEY = 'highScore';
	nowStage = 1000;
	scoreForNextStage = 100; //test시에 30
	grade = 1;

	constructor(ctx, scaleRatio) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.scaleRatio = scaleRatio;
	}

	update(deltaTime) {
		this.score += deltaTime * 0.001 * this.grade;
		if (Math.floor(this.score) >= this.scoreForNextStage && this.grade < 64) {
			sendEvent(11, { currentStage: this.nowStage, targetStage: this.nowStage + 1 });
			this.grade *= 2;
			this.nowStage++;
			this.scoreForNextStage += 100; //test시에 30
		}
	}

	getItem(itemId) {
		if (itemId <= this.grade) sendEvent(12, { currentStage: this.nowStage, itemId: itemId });
		this.itemScore += itemId * 10;
	}

	reset() {
		this.score = 0;
		this.itemScore = 0;
		this.nowStage = 1000;
		this.scoreForNextStage = 100; //test시에 30
		this.grade = 1;
	}

	setHighScore() {
		const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
		if (this.score > highScore) {
			localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
		}
	}

	getScore() {
		return this.score + this.itemScore;
	}

	draw() {
		const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
		const y = 20 * this.scaleRatio;

		const fontSize = 20 * this.scaleRatio;
		this.ctx.font = `${fontSize}px serif`;
		this.ctx.fillStyle = '#525250';

		const scoreX = this.canvas.width - 75 * this.scaleRatio;
		const highScoreX = scoreX - 125 * this.scaleRatio;

		const scorePadded = Math.floor(this.score + this.itemScore)
			.toString()
			.padStart(6, 0);
		const highScorePadded = highScore.toString().padStart(6, 0);

		this.ctx.fillText(scorePadded, scoreX, y);
		this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
	}

	loadTheStage() {
		return this.nowStage;
	}
}

export default Score;
