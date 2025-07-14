import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../Models/Iuser';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 get userData(): any {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}

get userId(): string {
  return this.userData?.id || '';
}

get LikedPost(): string[] {
  return this.userData?.postsLiked || [];
}

setLikedPosts(posts: string[]): void {
  const user = this.userData;
  if (user) {
    user.postsLiked = posts;
    // localStorage.setItem('user', JSON.stringify(user));
  }
}



  constructor(private httpclient:HttpClient, private router:Router) { }

getUserById(id:string):Observable<IUser>{
 return this.httpclient.get<IUser>(`${environment.apiUrl}/users/${id}`)
}
getALlUsers():Observable<IUser[]>{
 return this.httpclient.get<IUser[]>(`${environment.apiUrl}/users`)
}
  getUserByEmailAndPassword(email:string,password:string):Observable<IUser[]> {
    return this.httpclient.get<IUser[]>(`${environment.apiUrl}/users?email=${email}&password=${password}`);
  }

  getUser():Observable<IUser>{
        return this.httpclient.post<IUser>(`${environment.apiUrl}/login`, {}, { responseType: 'json' });
  }
  AddUser(user:IUser):Observable<IUser> {
    return this.httpclient.post<IUser>(`${environment.apiUrl}/users`, user);
  }
  UpdateUser(user:IUser):Observable<IUser>{
        return this.httpclient.put<IUser>(`${environment.apiUrl}/users/${user.id}`, user);

  }
  loginUser(credentials: { email: string, password: string }): Observable<any> {
  return this.httpclient.post(`${environment.apiUrl}/login`, credentials);
}

logout(){
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  localStorage.removeItem("token")
document.cookie = "user=; max-age=0"; // Expire cookie
  this.router.navigate(['/login']);
}

isLoggedIn():boolean{
  return localStorage.getItem("isLoggedIn") === "true";
}
login(){
  // localStorage.setItem("isLoggedIn","true");
  // if (this.userData && this.userData.accessToken) {
  //   localStorage.setItem("token", this.userData.accessToken);
  // }
}



}
