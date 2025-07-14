import { IUser } from "./Iuser";

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}
