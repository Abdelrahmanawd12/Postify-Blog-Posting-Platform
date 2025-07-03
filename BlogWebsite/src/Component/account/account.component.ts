import { Component, OnInit } from '@angular/core';
import { IUser } from '../../Models/Iuser';
import { PostsService } from '../../Services/posts.service';
import { IPosts } from '../../Models/Iposts';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../Services/modal.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
user:IUser ;
posts: IPosts[] = [] as IPosts[];



constructor(private postsService: PostsService,private _Router: Router,private _modal:ModalService) {
  // Initialization logic can go here if needed
  this.user = JSON.parse(localStorage.getItem("user") || '{}');
}

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

updatePost(id: string) {
  this._Router.navigateByUrl(`/updatepost/${id}`);
}
goToUpdateUser(id:string){
  this._Router.navigateByUrl(`/updateuser/${id}`);

}
confirmModalAction() {
  this._modal.confirm();
}
deletePost(id: string) {
  // Show confirmation modal before deleting
  this._modal.openModal("Are you sure you want to delete this post?", () => {

        this.postsService.deletePost(id).subscribe({
      next: () => {
        console.log("Post deleted successfully");
        this.getPostsByUserId(); // Refresh the list after deletion
      },
      error: (error) => {
        console.error("Error deleting post", error);
      }
    });
  });
}
}
