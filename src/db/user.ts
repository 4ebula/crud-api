import { randomUUID } from 'crypto';
import { UserInfo } from '../models/user.model';

export class User {
  private id = randomUUID();

  constructor(private username: string, private age: number, private hobbies: string[]) {}

  getUserInfo(): UserInfo {
    return {
      id: this.id,
      username: this.username,
      age: this.age,
      hobbies: this.hobbies,
    };
  }
}
