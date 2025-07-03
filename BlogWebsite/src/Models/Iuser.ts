export interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  maidenName: string,
  age: number,
  gender: string,
  email: string,
  phone: string,
  username: string,
  password: string,
  birthDate: string,
  image: string,
address: {
    address: string,
    city: string,
    state: string,
}
postsLiked: string[],
PostsDisLiked:string[]

}
