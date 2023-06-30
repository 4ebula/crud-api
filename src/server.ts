/* eslint-disable no-console */
import http from 'node:http';
import { DB } from './db';
import { Readable, pipeline } from 'node:stream';
import { REG_ENDPOINT_BASE, REG_USER_REPLACE, REG_UUID } from './utils';
import { StatusCodes } from './models';
import { UUID } from 'node:crypto';

export default class Server {
  private server: http.Server;
  private readonly db = DB.getInstance();

  constructor(readonly port: string) {}

  create(): Server {
    this.server = http.createServer((req, res) => this.hadnleRequests(req, res));

    return this;
  }

  listen(): void {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  }

  hadnleRequests(req: http.IncomingMessage, res: http.ServerResponse) {
    const { method, url } = req;
    if (!REG_ENDPOINT_BASE.test(url)) {
      this.sendError(res, StatusCodes.InvalidRequest, 'Resource not found');
      return;
    }

    const id = url.replace(REG_USER_REPLACE, '');

    switch (method) {
      case 'GET':
        this.handleGetRequest(id, res);
        break;
      case 'POST':
        this.handlePostRequest(req, res);
        break;
      case 'PUT':
        break;
      case 'DELETE':
        break;
      default:
        break;
    }
  }

  private handleGetRequest(id: string, res: http.ServerResponse): void {
    if (!id) {
      this.sendUsers(res);
      return;
    }

    if (REG_UUID.test(id)) {
      this.sendUser(id, res);
    } else {
      this.sendError(res, StatusCodes.InvalidRequest, 'Invalid id');
    }
  }

  private handlePostRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.headers['content-type'] !== 'application/json') {
      this.sendError(
        res,
        StatusCodes.InvalidRequest,
        'Wrong type of data. Use JSON'
      );
      return;
    }

    let body = Buffer.from('');
    req.on('data', chunk => (body += chunk));

    req.on('end', () => {
      const user = JSON.parse(body.toString());
      try {
        this.db.addUser(user);
        this.sendOK(res, 'Succesfully added');
      } catch (err) {
        this.sendError(res, StatusCodes.InvalidRequest, err.message);
      }
    });
  }

  private sendUsers(res: http.ServerResponse): void {
    const usersList = JSON.stringify(this.db.getUserList());
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = StatusCodes.OK;
    pipeline(Readable.from(usersList), res, err => console.log(err));
  }

  private sendUser(uuid: string, res: http.ServerResponse): void {
    const item = this.db.getUserById(uuid as UUID);
    if (!item) {
      this.sendError(res, StatusCodes.NotFound, `Item with id ${uuid} not found`);
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = StatusCodes.OK;
    pipeline(Readable.from(JSON.stringify(item)), res, err => console.log(err));
  }

  private sendError(res: http.ServerResponse, code: StatusCodes, message: string): void {
    res.statusCode = code;
    res.write(message);
    res.end();
  }

  private sendOK(res: http.ServerResponse, message: string): void {
    res.statusCode = StatusCodes.OK;
    res.end(message);
  }
}
