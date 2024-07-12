const dotenv = require("dotenv");
const path = require("path");

function setupEnv() {
	const env = process.env.NODE_ENV;
	console.log("The Node Environment is set to: ", env);

	let envPath = "";
	switch (env) {
		case "dev":
			envPath = path.join(__dirname, "../../envs/.env.dev");
			break;
		case "test":
			envPath = path.join(__dirname, "../../envs/.env.test");
			break;
		case "prod":
			envPath = path.join(__dirname, "../../envs/.env.prod");
			break;
		default:
			throw new Error(`'${env}' is not a valid NODE_ENV`);
	}

	dotenv.config({ path: envPath });
}

module.exports = { setupEnv };
