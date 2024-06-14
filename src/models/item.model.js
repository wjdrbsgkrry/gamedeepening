const itemEatTime = {};

export const createItemTimeChecker = uuid => {
	itemEatTime[uuid] = [];
};

export const getItemLastTimeChecker = uuid => {
	const EatTimeLine = itemEatTime[uuid];
	return EatTimeLine[EatTimeLine.length - 1];
};

export const getItemTimeChecker = uuid => {
	return itemEatTime[uuid];
};

export const setItemTimeChecker = (uuid, itemId, timestamp) => {
	console.log({ itemId, timestamp });
	return itemEatTime[uuid].push({ itemId, timestamp });
};

export const clearItemTimeChecker = uuid => {
	itemEatTime[uuid] = [];
};
