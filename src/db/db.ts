import { UUID } from 'crypto';
import { BaseUserInfo, UserInfo } from '../models/user.model';
import { User } from './user';
import { EmptyValueError, MissingPropertyError, WrongTypeError } from '../utils';

export class DB {
  static instance: DB;
  // private list: UserInfo[] = [];
  private list: UserInfo[] = [
    User.createFromArgs('John Dow', 15, ['sleeping']),
    User.createFromArgs('Jane Doe', 16, ['get missing']),
    User.createFromArgs('Jake Dow', 17, ['beign found', 'reading', 'tennis']),
  ];

  private constructor() {}

  static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }

    return DB.instance;
  }

  addUser(user: unknown): never | UserInfo {
    this.checkUser(user);
    return this.add(user as UserInfo);
  }

  updateUser(id: UUID, user: unknown): never | UserInfo {
    this.checkUser(user);
    return this.update(id, user as UserInfo | BaseUserInfo);
  }

  getUserList(): UserInfo[] {
    return this.list;
  }

  getUserById(id: UUID): UserInfo | null {
    return this.list.find(item => item.id === id) || null;
  }

  private add(userInfo: UserInfo): UserInfo {
    const newUser = new User(userInfo).getUserInfo();
    this.list.push(newUser);
    return newUser;
  }

  private update(id: UUID, user: UserInfo | BaseUserInfo) {
    const item = this.list.find(item => item.id === id);

    item.username = user.username;
    item.age = user.age;
    item.hobbies = [...user.hobbies];

    return item;
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
