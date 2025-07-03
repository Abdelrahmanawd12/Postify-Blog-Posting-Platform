import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../Models/Iuser';
import { LoginService } from '../../Services/login.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
userLogin:IUser ={} as IUser;
rememberMe:boolean = false;
constructor(private _LoginService:LoginService,private _router:Router){}
Logoin(){
  this._LoginService.getUserByEmailAndPassword(this.userLogin.email,this.userLogin.password).subscribe({
    next:(data:IUser[])=>{
      if(data.length>0){
        alert("Login Successful");
        localStorage.setItem("user",JSON.stringify(data[0]));
        this._LoginService.login();
        if (this.rememberMe) {
          document.cookie = "user=" + JSON.stringify(this.userLogin) + "; max-age=31536000"; // 1 year
        } else {
          document.cookie = "user=; max-age=0"; // Expire cookie
        }
        this._router.navigate(["/home"]);


      }else{
        alert("Invalid Email or Password");
      }
    },
    error:(err)=>{
      console.error(err);
      alert("An error occurred while logging in.");
    }
  });
}

}
