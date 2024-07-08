import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export function setupEnv() {
	const env = process.env.NODE_ENV;
	console.log("The Node Environment is set to: ", env);

	let envPath = "";
	switch (env) {
		case "dev":
			envPath = path.join(dirname, "../../envs/.env.dev");
			break;
		case "test":
			envPath = path.join(dirname, "../../envs/.env.test");
			break;
		case "prod":
			envPath = path.join(dirname, "../../envs/.env.prod");
			break;
		default:
			throw new Error(`'${env}' is not a valid NODE_ENV`);
	}

	dotenv.config({ path: envPath });
}
