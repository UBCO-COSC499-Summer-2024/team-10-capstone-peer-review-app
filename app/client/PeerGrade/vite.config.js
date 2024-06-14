import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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

	server: {
		host: "localhost",
		port: 3000,
		proxy: {
			"/api": { 
				target: "http://localhost:5001", 
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
