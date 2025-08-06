import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { IUser } from '../../Models/Iuser';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../Services/toast.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LanguageService } from '../../Services/language.service';
import { LanguageAction } from '../../Store/Language/Language.Action';

@Component({
  selector: 'app-update-account',
  imports: [ReactiveFormsModule,RouterLink,JsonPipe,CommonModule],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.css'
})
export class UpdateAccountComponent implements OnInit {

UpdatedUserForm !:FormGroup;
userData:IUser={}as IUser;
Language$=new Observable<string>;
  currentlang!: 'en' | 'ar';
constructor(private login:LoginService,private route:ActivatedRoute,private router:Router,
  private http :HttpClient, private toast:ToastService,private translator:LanguageService,
      private store:Store<{language: 'en' | 'ar'}>) {
         // Initialization logic can go here if needed
   this.Language$ = this.store.select("language");
    this.Language$.subscribe((lang) => {
      this.currentlang = lang as 'en' | 'ar';
      this.translator.currentlang = this.currentlang;
    });
      }
  users:IUser[] = [] as IUser[]

  ngOnInit(): void {
      this.getAllUsers();

    this.route.paramMap.subscribe(param=>{
  const userId=param.get('id')||''
this.login.getUserById(userId).subscribe({
  next:(data:IUser)=>{
    this.userData=data
    console.log("data fetched successfully",data)


    this.UpdatedUserForm = new FormGroup({
      firstName: new FormControl(this.userData.firstName, [

        Validators.pattern('^[a-zA-Z]{3,}$'),
      ]),
      lastName: new FormControl(this.userData.lastName, [

        Validators.pattern('^[a-zA-Z]{3,}$'),
      ]),
      maidenName: new FormControl(this.userData.maidenName, [
        Validators.pattern('^[a-zA-Z]{3,}$'),
      ]),
      age: new FormControl(this.userData.age),
      gender: new FormControl(this.userData.gender),

      email: new FormControl(this.userData.email, [
        Validators.required,
        Validators.pattern(
          '^[a-zA-Z][a-zA-Z0-9]*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        ),
      ]),
      phone: new FormControl(this.userData.phone, [
        Validators.required,
        Validators.pattern('^(010|011|012|015)[0-9]{8}$'),
      ]),
      username: new FormControl(this.userData.username, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z][a-zA-Z0-9._-]{4,}$'),
      ]),
      image: new FormControl(this.userData.image),

      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
        ),
      ]),
      address: new FormGroup({
        address: new FormControl(this.userData.address.address),
        city: new FormControl(this.userData.address.city,),
        state: new FormControl(this.userData.address.state, ),
      }),
    });
   this.IsEmailExistence();
        this.IsUsernameExistence();




  },
   error: (error) => {
        console.error("Error fetching post details for update", error);
      }

})
}
)

  }

// Add to your component class
showDebug = false;
showPassword = false;

toggleDebug(): void {
  this.showDebug = !this.showDebug;
}

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

removeImage(): void {
  this.previewUrl = null;
  this.selectedFile = null;
  this.UpdatedUserForm.patchValue({ image: 'assets/default-avatar.png' });
}
get firstName() {
  return this.UpdatedUserForm.get('firstName');
}

get lastName() {
  return this.UpdatedUserForm.get('lastName');
}

get maidenName() {
  return this.UpdatedUserForm.get('maidenName');
}

get age() {
  return this.UpdatedUserForm.get('age');
}

get gender() {
  return this.UpdatedUserForm.get('gender');
}
get image(){
  return this.UpdatedUserForm.get('image')
}

get email() {
  return this.UpdatedUserForm.get('email');
}

get phone() {
  return this.UpdatedUserForm.get('phone');
}

get username() {
  return this.UpdatedUserForm.get('username');
}

get password() {
  return this.UpdatedUserForm.get('password');
}

get address() {
  return this.UpdatedUserForm.get('address')?.get('address');
}
get city() {
  return this.UpdatedUserForm.get('address')?.get('city');
}

get state() {
  return this.UpdatedUserForm.get('address')?.get('state');
}

Update() {
  const updatedUser: IUser = {
    ...this.userData, // فيه الـ id وأي بيانات مش موجودة في الفورم
    ...this.UpdatedUserForm.value, // فيه القيم اللي المستخدم عدلها
    address: {
      ...this.userData.address,
      ...this.UpdatedUserForm.value.address
    }
  };

  this.login.UpdateUser(updatedUser).subscribe({
    next: (data: IUser) => {
      console.log("Post updated successfully", data);
      this.toast.show("Account Updated");
      this.router.navigateByUrl(`/account`);
        localStorage.setItem("user",JSON.stringify(data));
        document.cookie

    },
    error: (error) => {
      console.error("Error updating post", error);
    }
  });
}
 selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;


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
uploadImageAndRegister(): void {
    if (!this.selectedFile) {
     const defaultImageUrl = '';
    this.UpdatedUserForm.patchValue({ image: defaultImageUrl });
    this.Update();
    return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    const apiKey = environment.imgbbApiKey; //
    const uploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    this.http.post<any>(uploadUrl, formData).subscribe(
      (res) => {
        const imageUrl = res.data.url;
        this.UpdatedUserForm.patchValue({ image :imageUrl});

        // Send the final form data to fake API
        this.Update();
      },
      (err) => {
        console.error('Error uploading image:', err);
      }
    );
  }


getAllUsers(){
  this.login.getALlUsers().subscribe({
  next:(data:IUser[])=>{
   this.users=data;
   console.log("fetch successfully all users",data)
  this.IsEmailExistence()
  this.IsUsernameExistence();

  },error:(error)=>{
    console.log("error fetch all users", error)
  }
})
}
// AllEmails!:string[]
IsEmailExistence(): boolean {
    if (!this.UpdatedUserForm || !this.userData) return false;

    const currentEmail = this.UpdatedUserForm.get('email')?.value;
    if (!currentEmail) return false;

    const allEmails = this.users
      .filter(user => user.id !== this.userData.id)
      .map(user => user.email)
      .filter(email => !!email);

    const exists = allEmails.includes(currentEmail);

    if (exists) {
      this.email?.setErrors({ emailExists: true });
    } else {
      this.clearError('email', 'emailExists');
    }

    return exists;
  }

  private clearError(controlName: string, errorName: string): void {
    const control = this.UpdatedUserForm.get(controlName);
    if (control?.errors?.[errorName]) {
      const errors = { ...control.errors };
      delete errors[errorName];
      control.setErrors(Object.keys(errors).length ? errors : null);
    }
  }
 IsUsernameExistence(): boolean {
    if (!this.UpdatedUserForm || !this.userData) return false;

    const currentUsername = this.UpdatedUserForm.get('username')?.value;
    if (!currentUsername) return false;

    const allUsernames = this.users
      .filter(user => user.id !== this.userData.id)
      .map(user => user.username)
      .filter(username => !!username);

    const exists = allUsernames.includes(currentUsername);

    if (exists) {
      this.username?.setErrors({ usernameExists: true });
    } else {
      this.clearError('username', 'usernameExists');
    }

    return exists;
  }
getText(key: keyof typeof this.translator['texts']['en']) {
  return this.translator.getText(key);
}


  ChangeLanguage(){
this.store.dispatch(LanguageAction({lang:(this.currentlang==="en")?"ar":"en"}))

}

}
