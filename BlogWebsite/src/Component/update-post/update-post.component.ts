import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../Services/posts.service';
import { IPosts } from '../../Models/Iposts';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-post',
  imports: [FormsModule,CommonModule],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css'
})
export class UpdatePostComponent implements OnInit {
  previewUrl: string | ArrayBuffer | null=null;

  selectedFile: File | null = null;
post:IPosts = {} as IPosts;


constructor(private postsService: PostsService,
   private _Router: Router,
  private ActivateRoute:ActivatedRoute,
 private http:HttpClient)
 {

}

ngOnInit(): void {

 this.ActivateRoute.paramMap.subscribe(params => {
    const postId = params.get('id') || '';
    this.postsService.getPostById(postId).subscribe({
      next: (data: IPosts) => {
        this.post = data;
  this.previewUrl=this.post.imageUrl

        console.log("Post details fetched successfully for update", this.post);
      },
      error: (error) => {
        console.error("Error fetching post details for update", error);
      }
    });
  }
);
}
 onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

uploadImageAndSubmitPost(): void {
    if (!this.selectedFile) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    const apiKey = environment.imgbbApiKey;
    const uploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    this.http.post<any>(uploadUrl, formData).subscribe(
      (res) => {
    const imageUrl = res.data.url;
    this.post.imageUrl = imageUrl;
        // Send the final form data to fake API
        this.updatePost()
      },
      (err) => {
        console.error('Error uploading image:', err);
      }
    );
  }

updatePost() {
  this.postsService.updatePost(this.post).subscribe({
    next: (data: IPosts) => {
      console.log("Post updated successfully", data);
      alert("post Updated")

      this._Router.navigateByUrl(`/account`);

    },
    error: (error) => {
      console.error("Error updating post", error);
    }
  });
}

}
