const app = require('express')();
const path = require('path');
const fs = require('fs');


app.get('/:biz', (req, res) => {
	const biz = req.params.biz;
	console.log(biz, __dirname);
	const resFile = path.resolve(__dirname, `res/${biz}.html`);
	const errFile = path.resolve(__dirname, '404.html');

	if (fs.existsSync(resFile)) {
		res.sendFile(resFile);
	}
	else {
		res.sendFile(errFile)
	}
});


app.listen(3001, () => {
	console.log("listening on port");
})