import http from 'node:http';
import {handler} from './request-handler.mjs';

export const server = http.createServer(handler);
const port = Number(process.env.PORT) || 4173;
const host = process.env.HOST || '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Mix Alimentos: porta ${server.address().port}`);
});
