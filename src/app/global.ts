import { ApiService } from './services/api.service';

export class LoginModel {
  email: string;
  password: string;
  constructor(data: LoginModel) {
    this.email = data.email;
    this.password = data.password;
  }
}
export class AuthModel {
  token: string;
  role?: string;
  username?: string;
  constructor(data: AuthModel) {
    if (data) {
      this.token = data.token;
      if (data.role) {
        this.role = data.role;
      }
      if (data.username) {
        this.username = data.username;
      }
    }
  }
}

// export class AuthModel {
//   token: string;
//   role?: string;
//   username?: string;
//   constructor(
//     token: string,
//     role?: string,
//     username?: string,
//   ) {
//     this.token = token ? token : '';
//     if (role) {
//       this.role = role;
//     }
//     if (username) {
//       this.username = username;
//     }
//   }
// }
