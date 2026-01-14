const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const RES_DIR = path.join(__dirname, "res");

app.get("/:biz", (req, res) => {
	const biz = req.params.biz;

	// allow only letters, numbers, hyphens
	if (!/^[a-z0-9-]+$/i.test(biz)) {
		return res.status(404).sendFile(path.join(__dirname, "404.html"));
	}

	const filePath = path.join(RES_DIR, `${biz}.html`);
	const errFile = path.join(__dirname, "404.html");

	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (err) {
			return res.status(404).sendFile(errFile);
		}
		res.sendFile(filePath);
	});
});

app.listen( process.env.PORT || 3000, () => {
	console.log(`listening on port ${process.env.PORT || 3000}`);
});
