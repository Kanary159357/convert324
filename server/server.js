const express = require('express');
const app = express();

app.use((_, res, next) => {
	res.header('Cross-Origin-Opener-Policy', 'same-origin');
	res.header('Cross-Origin-Embedder-Policy', 'require-corp');
	res.header('Access-Control-Allow-Origin', 'researchgate.net');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(express.static('../public'));

const PORT = 8080;

app.listen(PORT, () => {
	console.log('server listening to ' + PORT);
});
