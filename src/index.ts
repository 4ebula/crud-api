import * as dotenv from 'dotenv';
import Server from './server';

dotenv.config();

new Server(process.env.PORT).create().listen();
