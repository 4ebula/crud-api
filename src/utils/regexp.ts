/* eslint-disable max-len */
export const REG_ENDPOINT_BASE = new RegExp(/^\/api\/users(\/.*)?/);
export const REG_USER_REPLACE = new RegExp(/^\/api\/users\/?/);
export const REG_UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);