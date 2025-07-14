import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule ,FormControl, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { IUser } from '../../Models/Iuser';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule,JsonPipe,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{

  users:IUser[] = [] as IUser[]
 selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

userRegistrationForm :FormGroup;
constructor(private login:LoginService,private router:Router,private http:HttpClient) {
  this.userRegistrationForm = new FormGroup({


    email:new FormControl('',[Validators.required,
Validators.pattern("^[a-zA-Z][a-zA-Z0-9]*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    ]),
    phone:new FormControl('',[Validators.required,
      Validators.pattern("^(010|011|012|015)[0-9]{8}$")
    ]),
    username:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(20),
Validators.pattern("^[a-zA-Z][a-zA-Z0-9._-]{4,}$")
    ]),
    password:new FormControl('',[Validators.required,
  Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]),

    firstName:new FormControl(''),
    lastName:new FormControl(''),
    maidenName:new FormControl(''),
    age:new FormControl(''),
    gender:new FormControl(''),
    image:new FormControl(''),
    address:new FormGroup({
      address:new FormControl(''),
      city:new FormControl(''),
      state:new FormControl(''),
    }),
    postsLiked:new FormControl([]),
    PostsDisLiked:new FormControl([]),
  });
}
  ngOnInit(): void {
  this.getAllUsers()
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
uploadImageAndRegister(): void {
    if (!this.selectedFile) {
     const defaultImageUrl = '';
    this.userRegistrationForm.patchValue({ image: defaultImageUrl });
    this.Register();
    return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    const apiKey = environment.imgbbApiKey; //
    const uploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    this.http.post<any>(uploadUrl, formData).subscribe(
      (res) => {
        const imageUrl = res.data.url;
        this.userRegistrationForm.patchValue({ image :imageUrl});

        // Send the final form data to fake API
        this.Register();
      },
      (err) => {
        console.error('Error uploading image:', err);
      }
    );
  }
Register(){
this.login.AddUser(this.userRegistrationForm.value).subscribe({
  next:(response)=>{
    // this.userRegistrationForm.reset();

Swal.fire({
  icon: 'success',
  title: 'Success',
  text: 'Registration successful!',
});

    this.router.navigate(['/login']);
  },
  error:(error)=>{
    console.error("Error registering user", error);
  }
});
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
IsEmailExistence():boolean{
const AllEmails = this.users.map(u => u.email).filter( e=>!!e)
if(AllEmails.includes(this.userRegistrationForm.value.email)){
  this.email?.setErrors({ emailExists: true });
  return true;
}
return false;
}
IsUsernameExistence():boolean{
const allUsernames = this.users.map(u => u.username).filter(u => !!u);
if (allUsernames.includes(this.userRegistrationForm.value.username)) {
  this.username?.setErrors({ usernameExists: true });
  return true;
}
return false;
}

get firstName() {
  return this.userRegistrationForm.get('firstName');
}

get lastName() {
  return this.userRegistrationForm.get('lastName');
}

get maidenName() {
  return this.userRegistrationForm.get('maidenName');
}

get age() {
  return this.userRegistrationForm.get('age');
}

get gender() {
  return this.userRegistrationForm.get('gender');
}

get email() {
  return this.userRegistrationForm.get('email');
}

get phone() {
  return this.userRegistrationForm.get('phone');
}

get username() {
  return this.userRegistrationForm.get('username');
}

get password() {
  return this.userRegistrationForm.get('password');
}

get address() {
  return this.userRegistrationForm.get('address')?.get('address');
}
get city() {
  return this.userRegistrationForm.get('address')?.get('city');
}

get state() {
  return this.userRegistrationForm.get('address')?.get('state');
}
}
