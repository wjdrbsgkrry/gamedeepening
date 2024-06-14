import { getGameAssets } from '../init/assets.js';
import { getUser } from '../models/user.model.js';
import { setStage, createStage } from '../models/stage.model.js';
import { createItemTimeChecker } from '../models/item.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { removeUser } from '../models/user.model.js';

export const handleDisconnect = (socket, uuid) => {
	removeUser(socket.id);
	console.log(`User disconnected: ${socket.id}`);
	console.log('Current users: ', getUser());
};

export const handleConnection = (socket, uuid) => {
	createStage(uuid);
	createItemTimeChecker(uuid);
	console.log(`New user connected!: ${uuid}`);
	socket.emit('connection', { uuid });
};

export const handlerEvent = (id, socket, data) => {
	if (!CLIENT_VERSION.includes(data.clientVersion)) {
		socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
		return;
	}

	//함수가져오기
	const handler = handlerMappings[data.handlerId];
	if (!handler) {
		socket.emit('response', { status: 'fail', message: 'Handler not found' });
		return;
	}

	//가져온 함수에 해당 인자넣기
	const response = handler(data.userid, data.payload);

	if (response.broadcast) {
		io.emit('response', 'broadcast');
		return;
	}

	socket.emit('response', response);
};

//스테이지에 따라서 더 높은 점수 획득
