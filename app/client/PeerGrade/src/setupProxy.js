import { createProxyMiddleware } from 'http-proxy-middleware';

import dotenv from 'dotenv'; 

dotenv.config();

const setupProxy = function (app) {
	app.use(
		"/api",
		createProxyMiddleware({
			target: `http://localhost:${process.env.BACKEND_PORT}`,
			changeOrigin: true
		})
	);
};

export default setupProxy;
