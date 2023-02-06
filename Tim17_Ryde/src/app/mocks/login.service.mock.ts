import { JwtAuthenticationRequest } from "../model/JwtAuthenticationRequest";
import { TokenResponse } from "../model/response/TokenResponse";

const mockLogin: TokenResponse = {
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuZWNhQHBlcm92aWMuY29tIiwicm9sZSI6IlJPTEVfRFJJVkVSIiwiaWQiOjEwMDEsImV4cCI6MTY3NzM0OTgzMywiaWF0IjoxNjc1NTQ5ODMzfQ.JSVcMX7sHbuJPycrxrLBrd83ju4A4Tw8mJK_UZ1E1M9WXRx5xMuKdxs9qFII5_hydk6_v7rnQoArbSfl1OBNog",
    expiresIn: 180000
};

export {mockLogin}

// import { Injectable } from '@angular/core';

// @Injectable()
// export class AuthServiceMock {
//   constructor() { }

//   login(): Array<{}> {
//       return [
//           {
//               name: 'user1',
//               surname: 'usersurname1'
//           }
//       ];
//   }
// }