import { UUID } from 'crypto';

export interface BaseUserInfo {
  username: string;
  age: number;
  hobbies: string[];
}

export interface UserInfo extends BaseUserInfo {
  id: UUID;
}
