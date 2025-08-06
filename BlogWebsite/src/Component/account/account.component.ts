import { Component, OnInit } from '@angular/core';
import { IUser } from '../../Models/Iuser';
import { PostsService } from '../../Services/posts.service';
import { IPosts } from '../../Models/Iposts';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../Services/modal.service';
import { ToastService } from '../../Services/toast.service';
import { Store } from '@ngrx/store';
import { LanguageService } from '../../Services/language.service';
import { Observable } from 'rxjs';
import { LanguageAction } from '../../Store/Language/Language.Action';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
user:IUser ;
posts: IPosts[] = [] as IPosts[];



constructor(private postsService: PostsService,private _Router: Router,private _modal:ModalService, private toast :ToastService,private translator:LanguageService,
    private store:Store<{language: 'en' | 'ar'}>) {
  // Initialization logic can go here if needed
  this.user = JSON.parse(localStorage.getItem("user") || '{}');
      // Initialization logic can go here if needed
    this.Language$ = this.store.select("language");
    this.Language$.subscribe((lang) => {
      this.currentlang = lang as 'en' | 'ar';
      this.translator.currentlang = this.currentlang;
    });
}
  Language$=new Observable<string>;
  currentlang!: 'en' | 'ar';
ngOnInit(): void {
  this.getPostsByUserId();

}


getPostsByUserId() {
  const userId = this.user.id;
  this.postsService.getPostsByUserId(userId).subscribe({
    next: (data: IPosts[]) => {
      this.posts = data;
      console.log("User posts fetched successfully", this.posts);
    },
    error: (error) => {
      console.error("Error fetching user posts", error);
    }
  });
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


goToUpdateUser(id:string){
  this._Router.navigateByUrl(`/updateuser/${id}`);

}
confirmModalAction() {
  this._modal.confirm();
}
updatePost(id: string) {
  this._Router.navigateByUrl(`/updatepost/${id}`);
}
deletePost(id: string) {
  // Show confirmation modal before deleting
  this._modal.openModal("Are you sure you want to delete this post?", () => {

        this.postsService.deletePost(id).subscribe({
      next: () => {
        console.log("Post deleted successfully");
        this.getPostsByUserId(); // Refresh the list after deletion
        this.toast.show("Post deleted successfully")
      },
      error: (error) => {
        console.error("Error deleting post", error);
      }
    });
  });
}
getText(key: keyof typeof this.translator['texts']['en']) {
  return this.translator.getText(key);
}


  ChangeLanguage(){
this.store.dispatch(LanguageAction({lang:(this.currentlang==="en")?"ar":"en"}))

}
}
