import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { IUser } from '../../Models/Iuser';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../Services/toast.service';

@Component({
  selector: 'app-update-account',
  imports: [ReactiveFormsModule,RouterLink,JsonPipe,CommonModule],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.css'
})
export class UpdateAccountComponent implements OnInit {

UpdatedUserForm !:FormGroup;
userData:IUser={}as IUser;
constructor(private login:LoginService,private route:ActivatedRoute,private router:Router, private http :HttpClient, private toast:ToastService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(param=>{
  const userId=param.get('id')||''
this.login.getUserById(userId).subscribe({
  next:(data:IUser)=>{
    this.userData=data
    console.log("data fetched successfully",data)


    this.UpdatedUserForm = new FormGroup({
        firstName:new FormControl(this.userData.firstName,[Validators.required,Validators.pattern('^[a-zA-Z]{3,}$')]),
        lastName:new FormControl(this.userData.lastName,[Validators.required,Validators.pattern('^[a-zA-Z]{3,}$')]),
        maidenName:new FormControl(this.userData.maidenName,[Validators.required,Validators.pattern('^[a-zA-Z]{3,}$')]),
        age:new FormControl(this.userData.age,[Validators.required]),
        gender:new FormControl(this.userData.gender,[Validators.required]),
        email:new FormControl(this.userData.email,[Validators.required,Validators.email]),
        phone:new FormControl(this.userData.phone,[Validators.required,
          Validators.pattern("^\\+\\d{1,3}[\\s-]?\\d{1,4}[\\s-]?\\d{3}[\\s-]?\\d{4}$")
        ]),
       image:new FormControl(''),

        username:new FormControl(this.userData.username,[Validators.required,Validators.minLength(3)]),
        password:new FormControl(this.userData.password,[Validators.required,
      Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]),
        address:new FormGroup({
          address:new FormControl(this.userData.address.address,[Validators.required]),
          city:new FormControl(this.userData.address.city,[Validators.required]),
          state:new FormControl(this.userData.address.state,[Validators.required]),
        })
      });





  },
   error: (error) => {
        console.error("Error fetching post details for update", error);
      }

})
}
)

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




}
