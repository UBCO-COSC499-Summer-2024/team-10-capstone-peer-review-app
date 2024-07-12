import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This dynamically sets the environment variables based on NODE_ENV

import "./src/utils/envConfig.js";

// Retrieve ENV vars from the .env file
const BACKEND_PORT = process.env.BACKEND_PORT;
const BACKEND_HOST = process.env.BACKEND_HOST;

console.log(`backend port is ${BACKEND_PORT}`);
console.log(`frontend host is ${BACKEND_HOST}`);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	// Ask Scott about changing dir location of build,
	// Not standard to put it outside of the project dir
	// build: {
	//   outDir: '../../../build/app/client/PeerGrade',
	// },

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	},

	// TODO add env variables for ports and target container names
	server: {
		watch: {
			usePolling: true
		},
		host: "0.0.0.0",
		port: 3000,
		proxy: {
			"/api": {
				// TODO set up https with ssl
				target: "http://peergrade-server-dev:5001",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "")
			}
		}
	}
});
