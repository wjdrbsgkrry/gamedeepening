import { getGameAssets } from '../init/assets.js';
import { getStage, setStage, clearStage } from '../models/stage.model.js';
import { setItemTimeChecker, clearItemTimeChecker, getItemTimeChecker } from '../models/item.model.js';

export const gameStart = (uuid, payload) => {
	const { stages } = getGameAssets();
	clearStage(uuid);
	clearItemTimeChecker(uuid);
	setStage(uuid, stages.data[0].id, payload.timestamp);
	return { status: 'gane Start success' };
};

export const gameEnd = (uuid, payload) => {
	const { timestamp: gameEndTime, score } = payload;
	const stages = getStage(uuid);
	const items = getItemTimeChecker(uuid);
	if (!stages.length) {
		return { status: 'fail', message: 'No stages found for user' };
	}

	let totalScore = 0;
	stages.forEach((stage, index) => {
		if (index === stages.length - 1) {
			totalScore += ((gameEndTime - stage.timestamp) / 1000) * Math.pow(2, index);
		} else {
			totalScore += ((stages[index + 1].timestamp - stage.timestamp) / 1000) * Math.pow(2, index);
		}
	});

	items.forEach((item, index) => {
		totalScore += item.itemId * 10;
	});

	//오차범위
	if (Math.abs(score - totalScore) > 10) {
		return { status: 'fail', message: 'Score verification failed' };
	}
	return { status: 'success', message: 'Game ended', score };
};
