import { Routes } from '@angular/router';
import { LoginComponent } from '../Component/login/login.component';
import { HomeComponent } from '../Component/home/home.component';
import { SignUpComponent } from '../Component/sign-up/sign-up.component';
import { PostDetailsComponent } from '../Component/post-details/post-details.component';
import { AccountComponent } from '../Component/account/account.component';
import { AddPostComponent } from '../Component/add-post/add-post.component';
import { UpdatePostComponent } from '../Component/update-post/update-post.component';
import { ErrorComponent } from '../Component/error/error.component';
import { UpdateAccountComponent } from '../Component/update-account/update-account.component';

export const routes: Routes = [
  {path:"login",loadComponent:() => import('../Component/login/login.component').then(m => m.LoginComponent),data:{hideNavbar:true}},
  {path:"",redirectTo:"home",pathMatch:"full"},
  {path:"home",loadComponent:()=> import('../Component/home/home.component').then(m => m.HomeComponent)},
  {path:"signup",loadComponent:() => import('../Component/sign-up/sign-up.component').then(m => m.SignUpComponent),data:{hideNavbar:true}},
  {path:"post/:id",loadComponent:() => import('../Component/post-details/post-details.component').then(m => m.PostDetailsComponent)},
  {path:"account",loadComponent:() => import('../Component/account/account.component').then(m => m.AccountComponent)},

  {path:"addpost",loadComponent:() => import('../Component/add-post/add-post.component').then(m => m.AddPostComponent)},
  {path:"updatepost/:id",loadComponent:() => import('../Component/update-post/update-post.component').then(m => m.UpdatePostComponent)},
  {path:"updateuser/:id",loadComponent:() => import('../Component/update-account/update-account.component').then(m => m.UpdateAccountComponent)},
  {path:"**",loadComponent:() => import('../Component/error/error.component').then(m => m.ErrorComponent),data:{hideNavbar:true}},
];
