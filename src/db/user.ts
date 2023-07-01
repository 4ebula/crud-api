import { randomUUID } from 'crypto';
import { BaseUserInfo, UserInfo } from '../models/user.model';

export class User {
  private id = randomUUID();

  constructor(private userInfo: BaseUserInfo) {}

  getUserInfo(): UserInfo {
    return {
      id: this.id,
      ...this.userInfo
    };
  }

  static createFromArgs(username: string, age: number, hobbies: string[]): UserInfo {
    return {
      id: randomUUID(),
      username,
      age,
      hobbies,
    }
  }
}
