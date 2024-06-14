import { createProxyMiddleware } from 'http-proxy-middleware';

import dotenv from 'dotenv'; 

dotenv.config();

const setupProxy = function (app) {
	app.use(
		"/api",
		createProxyMiddleware({
			// HARD CODED USE ENV VARS TODO
			target: `http://localhost:5001`,
			changeOrigin: true
		})
	);
};

export default setupProxy;
