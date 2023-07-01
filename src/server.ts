/* eslint-disable no-console */
import http from 'node:http';
import { DB } from './db';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { REG_ENDPOINT_BASE, REG_USER_REPLACE, REG_UUID } from './utils';
import { StatusCodes, UserInfo } from './models';
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
        this.handlePutRequest(id, req, res);
        break;
      case 'DELETE':
        break;
      default:
        break;
    }
  }

  private handleGetRequest(id: string, res: http.ServerResponse): void {
    if (!id) {
      const usersList = this.db.getUserList();
      this.sendWithContent(res, usersList);
      return;
    }

    if (REG_UUID.test(id)) {
      const item = this.db.getUserById(id as UUID);
      if (!item) {
        this.sendError(res, StatusCodes.NotFound, `Item with id ${id} not found`);
        return;
      }

      this.sendWithContent(res, item);
    } else {
      this.sendError(res, StatusCodes.InvalidRequest, 'Invalid id');
    }
  }

  private handlePostRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.headers['content-type'] !== 'application/json') {
      this.sendError(res, StatusCodes.InvalidRequest, 'Wrong type of data. Use JSON');
      return;
    }

    let body = Buffer.from('');
    req.on('data', chunk => (body += chunk));

    req.on('end', () => {
      try {
        const user = JSON.parse(body.toString());
        const newUser = this.db.addUser(user);
        this.sendWithContent(res, newUser);
      } catch (err) {
        this.sendError(res, StatusCodes.InvalidRequest, err.message);
      }
    });
  }

  private handlePutRequest(
    id: string,
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): void {
    if (!REG_UUID.test(id)) {
      this.sendError(res, StatusCodes.InvalidRequest, 'Invalid id');
      return;
    }

    const item = this.db.getUserById(id as UUID);
    if (!item) {
      this.sendError(res, StatusCodes.NotFound, `Item with id ${id} not found`);
      return;
    }

    let body = Buffer.from('');
    req.on('data', chunk => (body += chunk));

    req.on('end', async () => {
      const user = JSON.parse(body.toString());
      try {
        const updatedUser = this.db.updateUser(id as UUID, user);
        this.sendWithContent(res, updatedUser);
      } catch (err) {
        this.sendError(res, StatusCodes.InvalidRequest, err.message);
      }
    });
  }

  private sendError(res: http.ServerResponse, code: StatusCodes, message: string): void {
    res.statusCode = code;
    res.write(message);
    res.end();
  }

  private sendOK(res: http.ServerResponse): void {
    res.statusCode = StatusCodes.OK;
    res.end('OK');
  }

  private async sendWithContent(
    res: http.ServerResponse,
    content: UserInfo | UserInfo[]
  ): Promise<void> {
    try {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = StatusCodes.OK;
      await pipeline(Readable.from(JSON.stringify(content)), res);
    } catch {
      res.statusCode = StatusCodes.InternalError;
      res.end('Internal server error occured. Please try again later');
    }
  }
}
