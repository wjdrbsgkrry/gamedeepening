import Item from './Item.js';

class ItemController {
	nextInterval = null;
	items = [];

	constructor(ctx, itemImages, scaleRatio, speed) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.itemImages = itemImages;
		this.scaleRatio = scaleRatio;
		this.speed = speed;

		this.setNextItemTime();
	}

	//아이템 재생성 시간 10초로 고정
	setNextItemTime() {
		this.nextInterval = 10000;
	}

	// 0 ~ 4까지 생성하는 코드로 변경 min: 0 / max: 5
	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	createItem(nowStage) {
		// 현재 stage에 맞는 아이템이 생성되게끔 변경
		const index = this.getRandomNumber(0, nowStage - 1000);
		const itemInfo = this.itemImages[index];
		const x = this.canvas.width * 1.5;
		const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

		const item = new Item(this.ctx, itemInfo.id, x, y, itemInfo.width, itemInfo.height, itemInfo.image);

		this.items.push(item);
	}

	update(gameSpeed, nowStage, deltaTime) {
		if (this.nextInterval <= 0 && nowStage > 1000) {
			this.createItem(nowStage);
			this.setNextItemTime();
		}

		this.nextInterval -= deltaTime;

		this.items.forEach(item => {
			item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
		});

		this.items = this.items.filter(item => item.x > -item.width);
	}

	draw() {
		this.items.forEach(item => item.draw());
	}

	collideWith(sprite) {
		//find로 충돌난 아이템이 있는지 확인
		const collidedItem = this.items.find(item => item.collideWith(sprite));
		//충돌시 해당 아이템 id 반환
		if (collidedItem) {
			this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
			return {
				itemId: collidedItem.id,
			};
		}
	}

	reset() {
		this.items = [];
	}
}

export default ItemController;
