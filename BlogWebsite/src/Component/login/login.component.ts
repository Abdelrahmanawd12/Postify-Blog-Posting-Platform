import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../Models/Iuser';
import { LoginService } from '../../Services/login.service';
import Swal from 'sweetalert2';
import { ILoginResponse } from '../../Models/ILoginResponse';


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

Login(){
  this._LoginService.loginUser({
    email: this.userLogin.email,
    password: this.userLogin.password
  }).subscribe({
    next: (res:ILoginResponse) => {
      console.log('Login response:', res);
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("isLoggedIn","true");

            if (this.rememberMe) {
          document.cookie = "user=" + encodeURIComponent(JSON.stringify(res.user)) + "; max-age=31536000; path=/";
        document.cookie = `token=${res.accessToken}; max-age=31536000; path=/`;
        } else {
          document.cookie = "user=; max-age=0; path=/";
          document.cookie = "token=; max-age=0; path=/";
        }


      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Login successful!',
      });

      this._router.navigate(['/home']);
    },
    error: (err) => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password.'
      });
    }
  });
}
}
 // this._LoginService.login();



//   this._LoginService.getUserByEmailAndPassword(this.userLogin.email,this.userLogin.password).subscribe({
//     next:(data:IUser[])=>{
//       if(data.length>0){
//               Swal.fire({
//                 icon: 'success',
//                 title: 'Success',
//                 text: 'Login successful!',
//               });
//         localStorage.setItem("user",JSON.stringify(data[0]));
//         this._LoginService.login();
//         if (this.rememberMe) {
//           document.cookie = "user=" + JSON.stringify(this.userLogin) + "; max-age=31536000"; // 1 year
//         } else {
//           document.cookie = "user=; max-age=0"; // Expire cookie
//         }
//         this._router.navigate(["/home"]);


//       }else{
//         alert("Invalid Email or Password");
//       }
//     },
//     error:(err)=>{
//       console.error(err);
//       alert("An error occurred while logging in.");
//     }
//   });
// }
