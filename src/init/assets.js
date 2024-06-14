import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');
// fileURLToPath => 파일 url을 파일 경로로 변환한다.
// import.meta.url => 현재 모듈의 url을 제공한다. Ex) file:///path/to/your/file.js
//__dirname => 파일 이름을 제외한 디렉토리(폴더)의 경로를 가져온다. Ex) /src/init
//basePath => assets 폴더 경로

const readFileAsync = filename => {
	return new Promise((resolve, reject) => {
		fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(JSON.parse(data));
		});
	});
};
// Promise를 new로 생성한 이유는? 병렬처리로 파일을 읽어서 빠르게 파일 읽기 작업을 끝낼 것이다.
// 하지만 가장 늦게 읽는 파일을 기다려야하기 때문에 Promise.all 메서드를 이용해 모든 파일을 읽어올 때까지 기다리는 메서드를 사용.
// readFile(파일명, 옵션, 콜백함수) => 비동기식
// filename만 인자로 받아서 assets라는 파일과 filename만 붙이면 aseets 폴더에 있는 파일을 읽을 수 있다.

export const loadGameAssets = async () => {
	try {
		const [stages, items, itemUnlocks] = await Promise.all([
			readFileAsync('stage.json'),
			readFileAsync('item.json'),
			readFileAsync('item_unlock.json'),
		]);

		gameAssets = { stages, items, itemUnlocks };
		return gameAssets;
	} catch (err) {
		throw new Error('Faiiled to load game assets: ' + err.message);
	}
};
//이 코드는 하드 코딩식으로 해당 파일에 있는 코드들을 모두 읽고 있다.

export const getGameAssets = () => {
	return gameAssets;
};
