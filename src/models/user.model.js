const users = [];
//연결된 유저들을 담는 배열

export const addUser = user => {
	users.push(user);
};
//연결 유저 배열에 담기

export const removeUser = socketId => {
	const index = users.findIndex(user => user.socketId === socketId);
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};
//유저 연결이 끊기면 실핼될 함수
//socketId를 이용해 만약 findIndex로 찾으면 해당 유저를 배열에서 삭제

export const getUser = () => {
	return users;
};
