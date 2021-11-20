const express = require('express');
const app = express();

app.use((_, res, next) => {
	res.header('Cross-Origin-Opener-Policy', 'same-origin');
	res.header('Cross-Origin-Embedder-Policy', 'require-corp');
	next();
});

app.use(express.static('../public'));

const PORT = 8080;

app.listen(PORT, () => {
	console.log('server listening to ' + PORT);
});
