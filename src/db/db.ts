import { UUID } from 'crypto';
import { UserInfo } from '../models/user.model';
import { User } from './user';
import { EmptyValueError, MissingPropertyError, WrongTypeError } from '../utils';

export class DB {
  static instance: DB;
  // private list: UserInfo[] = [];
  private list: UserInfo[] = [
    new User('John Dow', 15, ['sleeping']).getUserInfo(),
    new User('Jane Doe', 16, ['get missing']).getUserInfo(),
    new User('Jake Dow', 17, ['beign found', 'reading', 'tennis']).getUserInfo(),
  ];

  private constructor() {}

  static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }

    return DB.instance;
  }

  addUser(user: unknown): never | void {
    this.checkUser(user);
    this.add(user as UserInfo);
  }

  add(user: UserInfo): DB {
    this.list.push(user);
    return this;
  }

  getUserList(): UserInfo[] {
    return this.list;
  }

  getUserById(id: UUID): UserInfo | null {
    return this.list.find(item => item.id === id) || null;
  }

  private checkUser(user: unknown): never | void {
    if (Object.prototype.toString.call(user).toLowerCase().slice(8, -1) !== 'object') {
      throw new Error('Not an object');
    }

    if (!Object.prototype.hasOwnProperty.call(user, 'username')) {
      throw new MissingPropertyError('username');
    }

    if (!Object.prototype.hasOwnProperty.call(user, 'age')) {
      throw new MissingPropertyError('age');
    }

    if (!Object.prototype.hasOwnProperty.call(user, 'hobbies')) {
      throw new MissingPropertyError('hobbies');
    }

    const { username, age, hobbies } = user as UserInfo;

    if (typeof username !== 'string') {
      throw new WrongTypeError('username', 'string');
    }

    if (!username) {
      throw new EmptyValueError('username');
    }

    if (typeof age !== 'number') {
      throw new WrongTypeError('age', 'number');
    }

    if (typeof username !== 'string') {
      throw new WrongTypeError('username', 'string');
    }

    hobbies.forEach((hobby: unknown) => {
      if (typeof hobby !== 'string') {
        throw new WrongTypeError('hobby', 'string[]');
      }
    });
  }
}
