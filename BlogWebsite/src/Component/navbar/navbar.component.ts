import { Component, OnInit, Pipe } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { PostsService } from '../../Services/posts.service';
import { IPosts } from '../../Models/Iposts';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LanguageAction } from '../../Store/Language/Language.Action';
import { Observable } from 'rxjs';
import { LanguageService } from '../../Services/language.service';
import { ModalService } from '../../Services/modal.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent  {

  language$=new Observable<string>
  currentlang!: 'en' | 'ar';


constructor(private loginService: LoginService,
  private postsServices:PostsService,
    private Translator:LanguageService,
    private router:Router,
    private modal:ModalService    ,
  private store:Store<{language: 'en' | 'ar'}>
) {
this.language$=store.select("language");
this.language$.subscribe((lang)=>{
  this.currentlang = lang as 'en' | 'ar';
    this.Translator.currentlang=this.currentlang

})
}


getText(key: keyof typeof this.Translator['texts']['en']) {
  return this.Translator.getText(key);
}


  ChangeLanguage(){
this.store.dispatch(LanguageAction({lang:(this.currentlang==="en")?"ar":"en"}))

}
  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }


  logout(): void {
   if(window.confirm("are you sure you want to logout?")){
    this.loginService.logout()
   }

  }

  searchedPosts:IPosts[]=[] as IPosts[]
  searchByTitleAndTag(keyword: string) {
  if (keyword.trim() === '') {
    this.RemoveSearch();
    return;
  }

  this.postsServices.getAllPosts().subscribe(posts => {
    const byTitle = posts.filter(post => post.title.toLowerCase().includes(keyword.toLowerCase()));
    const byTag = posts.filter(post => post.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())));

    const merged = [...byTitle];

    byTag.forEach(taggedPost => {
      if (!merged.some(p => p.id === taggedPost.id)) {
        merged.push(taggedPost);
      }
    });

    this.searchedPosts = merged;
    console.log("Posts found by title or tag:", this.searchedPosts);
  });
}

  RemoveSearch(){
    this.searchedPosts=[]
  }




}
