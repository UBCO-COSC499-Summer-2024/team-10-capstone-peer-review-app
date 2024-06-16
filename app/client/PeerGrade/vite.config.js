import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { watch } from "fs";

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
			// This enables hot module replacement for docker containers
			usePolling: true,
		},
		host: "0.0.0.0", 
		port: 3000,
		proxy: {
			"/api": { 
				target: "http://peergrade_server:5001", 
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
