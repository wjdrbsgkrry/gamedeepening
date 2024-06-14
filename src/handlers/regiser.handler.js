import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

//io를 받아서 connection라는 이벤트가 발생할 때까지 대기한다. 2번째 인자는 발동 콜백함수
const regiserHandler = io => {
	io.on('connection', socket => {
		const userUUID = uuidv4(); //유저 uuid 만들기
		addUser({ uuid: userUUID, socketId: socket.id }); //유저 배열에 등록

		handleConnection(socket, userUUID); //메모리에 유저의 스테이지 등록

		socket.on('event', data => handlerEvent(io, socket, data)); //event 이벤트 발생시 클라이언트의 정보값을 가져와서 콜백함수 실행

		socket.on('disconnect', socket => {
			handleDisconnect(socket, userUUID);
		});
	});
};
// uuidv4는 uuid를 만드는 방법 중 하나이다.
// io.on은 서버를 대상으로 모든 유저에게 적용
// socket.on은 하나의 유저를 지목해서 해당 유저만 적용

export default regiserHandler;
