import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../Component/navbar/navbar.component";
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { ErrorComponent } from '../Component/error/error.component';
import { LoginComponent } from '../Component/login/login.component';
import { SignUpComponent } from '../Component/sign-up/sign-up.component';
import { SpinnerComponent } from "../Component/spinner/spinner.component";
import { LoginService } from '../Services/login.service';
import { IUser } from '../Models/Iuser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'BlogWebsite';
  language$=new Observable<string>
  dir:string="ltr"

  showNavbar: boolean = true;
 private hiddenNavbarComponents = new Set([LoginComponent, SignUpComponent, ErrorComponent]);


  constructor(private store:Store<{language:string}>,private router:Router,private route:ActivatedRoute,private _LoginService:LoginService,private _router:Router) {
      this.language$=this.store.select("language");
      this.language$.subscribe((lang)=>
        {
          this.dir=(lang==="en")?"ltr":"rtl"
        });

this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.getDeepestChild(this.route);
        this.showNavbar = !currentRoute.snapshot.data['hideNavbar'];
      });
  }


  ngOnInit() {
    if (document.cookie.includes("user=")) {
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='))
        ?.split('=')[1];

      if (userCookie) {
        const userObj = JSON.parse(decodeURIComponent(userCookie));
        this._LoginService.getUserByEmailAndPassword(userObj.email,userObj.password).subscribe({
            next:(data:IUser[])=>{
              if(data.length>0){
                alert("you are still logged in");
                localStorage.setItem("user",JSON.stringify(data[0]));

                this._LoginService.login();
              }
            }
          });
        // this._LoginService.setLikedPosts(userObj.postsLiked || []);
        this.router.navigate(['/home']);
      }
    }
  }
  getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

}


