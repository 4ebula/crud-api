# CRUD API

---

### Prerequisites
1. Install [Node.js](https://nodejs.org/en/download/)   
3. Clone this repo
4. Go to folder `crud-api`  
5. To install all dependencies use [`npm install`](https://docs.npmjs.com/cli/install)  
6. Run **scripts** in command line.

---

### Scripts

```bash
# to launch server in dev mode
$ npm run start:dev

# to launch server in prod mode
$ npm run start:prod
```
---

### Endpoints

Base URL: `http://localhost:4000/`

- **GET** `api/users` is used to get all persons
  - Server would answer with `status code` **200** and all users records
- **GET** `api/users/{userId}` 
  - Server would answer with `status code` **200** and record with `id === userId` if it exists
  - Server would answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server would answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
- **POST** `api/users` is used to create record about new user and store it in database
  - Server would answer with `status code` **201** and newly created record
  - Server would answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
- **PUT** `api/users/{userId}` is used to update existing user
  - Server would answer with` status code` **200** and updated record
  - Server would answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server would answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
- **DELETE** `api/users/{userId}` is used to delete existing user from database
  - Server would answer with `status code` **204** if the record is found and deleted
  - Server would answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server would answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist

For `POST` and `PUT` requests you would send an object as a JSON.
It would have following properties:
  - `id` — unique identifier (`string`, `uuid`) generated on server side
  - `username` — user's name (`string`, **required**)
  - `age` — user's age (`number`, **required**)
  - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)


Requests to non-existing endpoints (e.g. `some-non/existing/resource`) would response with `status code` **404** and corresponding message