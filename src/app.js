import express from 'express';
import { IncomingMessage, ServerResponse, createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

server.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);

	const assets = await loadGameAssets();
	console.log(assets);
});
