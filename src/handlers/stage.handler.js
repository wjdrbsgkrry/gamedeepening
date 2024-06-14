import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const moveStageHandler = (userId, payload) => {
	let currentStages = getStage(userId);
	if (!currentStages.length) {
		return { status: 'fail', message: 'No stages found for user' };
	}

	//오름차순 -> 가장 큰 스테이지 ID 확인 <- 유저의 현재 스테이지
	currentStages.sort((a, b) => a.id - b.id);
	const currentStage = currentStages[currentStages.length - 1];

	//클라이언트 vs 서버 비교
	if (currentStage.id !== payload.currentStage) {
		return { status: 'fail', message: 'Current Stage mismatch' };
	}

	//점수 검증
	const serverTime = Date.now();
	const elapseTime = (serverTime - currentStage.timestamp) / 1000;
	if (elapseTime < 30 / currentStage.scorePerSecond || elapseTime > 33 / currentStage.scorePerSecond) {
		return { status: 'fail', message: 'Invalid elapsed time' };
	}

	// target
	const { stages } = getGameAssets();
	if (!stages.data.some(stage => stage.id === payload.targetStage)) {
		return { status: 'fail', message: 'Target stage not found' };
	}

	setStage(userId, payload.targetStage, serverTime);

	return { status: 'success' };
};
