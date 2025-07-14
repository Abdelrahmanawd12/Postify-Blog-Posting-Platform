import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPosts } from '../../Models/Iposts';
import { PostsService } from '../../Services/posts.service';
import { LoginService } from '../../Services/login.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { Observable } from 'rxjs';
import { LanguageService } from '../../Services/language.service';
import { Store } from '@ngrx/store';
import { LanguageAction } from '../../Store/Language/Language.Action';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-post',
  imports: [ReactiveFormsModule, CommonModule, JsonPipe],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  addPostForm:FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  language$=new Observable<string>;
  currentlang!: 'en' | 'ar';

  constructor(private formBuilder: FormBuilder,
        private Translator:LanguageService,

    private postsService: PostsService,
    private Login:LoginService,
      private http: HttpClient,
      private router:Router,
        private store:Store<{language: 'en' | 'ar'}>

  ) {

this.language$=store.select("language");
this.language$.subscribe((lang)=>{
  this.currentlang = lang as 'en' | 'ar';
    this.Translator.currentlang=this.currentlang
})
    // Initialize the form with default values and validators
      this.addPostForm = this.formBuilder.group({
        title: ['',[Validators.required, Validators.minLength(2)]],
        body: ['',[Validators.required, Validators.minLength(5)]],
        tags: new FormArray([new FormControl('')]),
        reactions: this.formBuilder.group({
          likes: [0],
          dislikes: [0]
        }),
        views: [0],
        userId: [this.Login.userId],
        imageUrl:['']
      });
     }
get title() {
    return this.addPostForm.get('title') as FormControl;
  }
get body() {
    return this.addPostForm.get('body') as FormControl;
  }

      get tags(){
      return this.addPostForm.get('tags') as FormArray;
     }
     addTag(){
        this.tags.push(new FormControl(""))
     }
     removeTag(index: number){
      if(index>0 && index < this.tags.length){
        // Ensure at least one tag remains
        this.tags.removeAt(index);
     }
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
     const defaultImageUrl = '';
    this.addPostForm.patchValue({ imageUrl: defaultImageUrl });
    this.AddPost();
    return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    const apiKey = environment.imgbbApiKey; //
    const uploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    this.http.post<any>(uploadUrl, formData).subscribe(
      (res) => {
        const imageUrl = res.data.url;
        this.addPostForm.patchValue({ imageUrl });

        // Send the final form data to fake API
        this.AddPost();
      },
      (err) => {
        console.error('Error uploading image:', err);
      }
    );
  }
  removeImage() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.addPostForm.patchValue({ imageUrl: '' });
  }
@Output() showAddPost = new EventEmitter<boolean>();

AddPost(){
this.postsService.AddPost(this.addPostForm.value).subscribe({
  next: (response: IPosts) => {
    console.log('Post added successfully:', response);
Swal.fire({
  icon: 'success',
  title: 'Success',
  text: 'Post added successfully!',
});
  this.postsService.emitPostsUpdate(); // Emit an update to notify other components

  this.showAddPost.emit(false);

  this.router.navigate(['/home']);

  },
  error: (error) => {
    console.error('Error adding post:', error);
  }
})
}

close(){
  this.showAddPost.emit(false);
  this.router.navigate(['/home']);
}
getText(key: keyof typeof this.Translator['texts']['en']) {
  return this.Translator.getText(key);
}


  ChangeLanguage(){
this.store.dispatch(LanguageAction({lang:(this.currentlang==="en")?"ar":"en"}))

}



  }


