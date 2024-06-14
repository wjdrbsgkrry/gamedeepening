import { getItemLastTimeChecker, setItemTimeChecker } from '../models/item.model.js';

const correctionValue = 1000;

export const exportItemInfo = (userId, payload) => {
	const itemId = payload.itemId;
	// 해당 시간에 맞는 아이템이였는지 검증.
	if (payload.itemId > payload.currentStage - correctionValue)
		return { status: 'fail', message: 'Item currently unavailable' };

	//해당 아이템을 먹은 시간대가 이전에 아이템을 먹은 시간대와의 차이를 확인
	const serverTime = Date.now();
	const beforeItemEatTime = getItemLastTimeChecker();
	if (beforeItemEatTime) {
		const elapseTime = (serverTime - beforeItemEatTime) / 1000;
		if (elapseTime < 10) return { status: 'fail', message: 'Invalid elapsed time' };
	}

	setItemTimeChecker(userId, payload.itemId, serverTime);

	return { status: 'item Checker success' };
};
