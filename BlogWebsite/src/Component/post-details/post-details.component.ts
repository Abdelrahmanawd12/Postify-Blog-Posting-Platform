import { Component, OnInit } from '@angular/core';
import { IPosts } from '../../Models/Iposts';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../Services/posts.service';
import { CommonModule } from '@angular/common';
import { IUser } from '../../Models/Iuser';
import { LoginService } from '../../Services/login.service';
import { Store } from '@ngrx/store';
import { LanguageService } from '../../Services/language.service';
import { Observable } from 'rxjs';
import { LanguageAction } from '../../Store/Language/Language.Action';

@Component({
  selector: 'app-post-details',
  imports: [CommonModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {

post:IPosts = {} as IPosts;
Language$=new Observable<string>;
  currentlang!: 'en' | 'ar';
constructor(private postsService: PostsService, private route: ActivatedRoute,private login: LoginService,private translator:LanguageService,
    private store:Store<{language: 'en' | 'ar'}>,private _router:Router
  ) {
  // Initialization logic can go here if needed
   this.Language$ = this.store.select("language");
    this.Language$.subscribe((lang) => {
      this.currentlang = lang as 'en' | 'ar';
      this.translator.currentlang = this.currentlang;
    });
}
ngOnInit(): void {
 this.route.paramMap.subscribe(params => {
    const postId = params.get('id')||'';
    this.postsService.getPostById(postId).subscribe({
      next: (data: IPosts) => {
        this.post = data;
        console.log("Post details fetched successfully", this.post);
      },
      error: (error) => {
        console.error("Error fetching post details", error);
      }
    });
  }

  );
  this.getAllUsers();


}
  users: IUser[] = [];
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
likePost(post:IPosts){
  if (!this.login.isLoggedIn()) {
    this._router.navigate(['/login']);
    return;
  }
  this.postsService.LikeToggle(post).subscribe({
    next: () => {
      console.log("Post liked successfully");
      this.ngOnInit() // Refresh the list after liking
    },
    error: (error) => {
      console.error("Error liking post", error);
    }
  });
 }
 dislikePost(post:IPosts){
  if (!this.login.isLoggedIn()) {
    this._router.navigate(['/login']);
    return;
  }
  this.postsService.DislikeToggle(post).subscribe({
    next:()=>{
        console.log("Post disliked successfully");
      this.ngOnInit() // Refresh the list after liking
    },
    error:(error)=>{
            console.error("Error liking post", error);

    }

  })
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

getText(key: keyof typeof this.translator['texts']['en']) {
  return this.translator.getText(key);
}


  ChangeLanguage(){
this.store.dispatch(LanguageAction({lang:(this.currentlang==="en")?"ar":"en"}))

}


}
