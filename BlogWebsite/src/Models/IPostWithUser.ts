import { IPosts } from "./Iposts";
import { IUser } from "./Iuser";

export interface IPostWithUser extends IPosts {
  user?: IUser;
}
