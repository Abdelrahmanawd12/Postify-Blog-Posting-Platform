import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PostsService } from '../../Services/posts.service';
import { IPosts } from '../../Models/Iposts';
import { Route, Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { IUser } from '../../Models/Iuser';
import { CommonModule } from '@angular/common';
import { AddPostComponent } from "../add-post/add-post.component";
import { Element } from '@angular/compiler';
import { Observable } from 'rxjs';
import { LanguageService } from '../../Services/language.service';
import { Store } from '@ngrx/store';
import { LanguageAction } from '../../Store/Language/Language.Action';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AddPostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private postsService: PostsService,private _Router:Router,
    private login:LoginService,private translator:LanguageService,
    private store:Store<{language: 'en' | 'ar'}>
  ) {
    // Initialization logic can go here if needed
    this.Language$ = this.store.select("language");
    this.Language$.subscribe((lang) => {
      this.currentlang = lang as 'en' | 'ar';
      this.translator.currentlang = this.currentlang;
    });
  }
  posts:IPosts[] = [] as IPosts[];
  users: IUser[] = [];
  Language$=new Observable<string>;
  currentlang!: 'en' | 'ar';
 isLoggedIn(): boolean {
    return this.login.isLoggedIn();
  }

  ngOnInit(): void {
    this.GetAllPosts();
    this.getAllUsers();
     this.postsService.postsUpdated$.subscribe(() => {
    this.GetAllPosts(); // 
  });

  }

 GetAllPosts() {
   this.postsService.getAllPosts().subscribe({
     next: (data: IPosts[]) => {
       this.posts = data.reverse();
        console.log("Posts fetched successfully", this.posts);
     },
     error: (error) => {
       console.error("Error fetching posts", error);
     }
   });
 }
 getAllUsers(){
  this.login.getALlUsers().subscribe({
    next:(date)=> {
      this.users=date
    },error:(err)=> {
       console.error("Error fetching Users posts", err);

    },
  })

 }

  getUserById(id: string): IUser | undefined {
  return this.users.find(u => u.id === id);
}

isLiked(post: IPosts): boolean {
  if (!this.login.isLoggedIn()) {
    return false;
  }
  const user = this.login.userData;
  return user.postsLiked ? user.postsLiked.includes(post.id) : false;
}
isDisliked(post:IPosts):boolean{
  if (!this.login.isLoggedIn()) {

    return false;
  }
  const user = this.login.userData;
  return user.PostsDisLiked ? user.PostsDisLiked.includes(post.id) : false;
}

 likePost(post:IPosts){
  this.postsService.LikeToggle(post).subscribe({
    next: () => {
      console.log("Post liked successfully");
      this.GetAllPosts(); // Refresh the list after liking
    },
    error: (error) => {
      console.error("Error liking post", error);
      this._Router.navigateByUrl('/login');
    }
  });
 }
 dislikePost(post:IPosts){
  this.postsService.DislikeToggle(post).subscribe({
    next:()=>{
        console.log("Post disliked successfully");
      this.GetAllPosts(); // Refresh the list after liking
    },
    error:(error)=>{
            console.error("Error liking post", error);
      this._Router.navigateByUrl('/login');

    }

  })
 }

 viewPost(id:string){
  this._Router.navigateByUrl(`/post/${id}`);
  this.postsService.getPostAndUpdateViews(id).subscribe({
    next: (data: IPosts) => {
      console.log("Post views updated successfully", data);
    },
    error: (error) => {
      console.error("Error updating post views", error);
    }
  });
 }

showAddPostComponent: boolean = false;

toggleAddPost(value: boolean) {
  this.showAddPostComponent = value;
}


getText(key: keyof typeof this.translator['texts']['en']) {
  return this.translator.getText(key);
}


  ChangeLanguage(){
this.store.dispatch(LanguageAction({lang:(this.currentlang==="en")?"ar":"en"}))

}
}
