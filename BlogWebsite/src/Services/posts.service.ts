import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { IPosts } from '../Models/Iposts';
import { environment } from '../environments/environment.development';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { IUser } from '../Models/Iuser';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient :HttpClient,private _login:LoginService, private router:Router) { }


  getAllPosts():Observable<IPosts[]>{
    return this.httpClient.get<IPosts[]>(`${environment.apiUrl}/posts`);
  }
  getPostById(id: string): Observable<IPosts> {
    return this.httpClient.get<IPosts>(`${environment.apiUrl}/posts/${id}`);
  }
  getPostByTitle(title:string):Observable<IPosts[]>{
    return this.httpClient.get<IPosts[]>(`${environment.apiUrl}/posts?title=${title}`);

  }


  getPostsByUserId(userId: string): Observable<IPosts[]> {
    return this.httpClient.get<IPosts[]>(`${environment.apiUrl}/posts?userId=${userId}`);
  }

  // update views of a post by id
 getPostAndUpdateViews(id: string): Observable<IPosts> {
  return this.getPostById(id).pipe(
    switchMap(post => {
      const updatedViews = post.views + 1;
      return this.httpClient.patch<IPosts>(`${environment.apiUrl}/posts/${id}`, { views: updatedViews });
    })
  );
}

LikeToggle(post: IPosts): Observable<any> {
  if (!this._login.isLoggedIn()) {
    return throwError(() => new Error('User not logged in'));
  }

  const user = this._login.userData;
  const postsLiked = [...user.postsLiked];
  const index = postsLiked.indexOf(post.id);
  let updatedLikes = post.reactions.likes;

  // Toggle logic
  if (index === -1) {
    postsLiked.push(post.id);
    updatedLikes += 1;
  } else {
    postsLiked.splice(index, 1);
    updatedLikes -= 1;
  }

  // Prepare requests
  const updateUser$ = this.httpClient.patch<IUser>(
    `${environment.apiUrl}/users/${user.id}`,
    { postsLiked }
  ).pipe(tap(updatedUser => {
    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }));

  const updatePost$ = this.httpClient.patch<IPosts>(
    `${environment.apiUrl}/posts/${post.id}`,
    {
      reactions: {
        ...post.reactions,
        likes: updatedLikes
      }
    }
  );

  // Run both updates in parallel
  return forkJoin({
    user: updateUser$,
    post: updatePost$
  });
}

DislikeToggle(post: IPosts): Observable<any> {
  if (!this._login.isLoggedIn()) {
    return throwError(() => new Error('User not logged in'));
  }

  const user = this._login.userData;
  const PostsDisLiked = [...user.PostsDisLiked];
  const index = PostsDisLiked.indexOf(post.id);

  let updatedDislikes = post.reactions.dislikes;

  if (index === -1) {
    PostsDisLiked.push(post.id);
    updatedDislikes += 1;
  } else {
    PostsDisLiked.splice(index, 1);
    updatedDislikes = Math.max(0, updatedDislikes - 1);
  }

  const updateUser$ = this.httpClient.patch<IUser>(
    `${environment.apiUrl}/users/${user?.id}`,
    { PostsDisLiked }
  ).pipe(
    tap(updatedUser => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    })
  );

  const updatePost$ = this.httpClient.patch<IPosts>(
    `${environment.apiUrl}/posts/${post.id}`,
    {
      reactions: {
        ...post.reactions,
        dislikes: updatedDislikes
      }
    }
  );

  return forkJoin({
    user: updateUser$,
    post: updatePost$
  });
}





AddPost(post:IPosts): Observable<IPosts> {
  return this.httpClient.post<IPosts>(`${environment.apiUrl}/posts`, post);
}


updatePost(post: IPosts): Observable<IPosts> {
  post.IsUpdated=true;
  return this.httpClient.put<IPosts>(`${environment.apiUrl}/posts/${post.id}`, post);
}

deletePost(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/posts/${id}`);
}


private postsUpdated = new Subject<void>();
postsUpdated$ = this.postsUpdated.asObservable();

emitPostsUpdate() {
  this.postsUpdated.next();
  }

//add comment
AddComment(postId: string, comment: { userId: string; content: string }): Observable<IPosts> {
  return this.httpClient.get<IPosts>(`${environment.apiUrl}/posts/${postId}`).pipe(
    switchMap(post => {
      const newComment = {
        id: this.generateRandomId(),
        userId: comment.userId,
        body: comment.content,
        likes: 0
      };
      const updatedComments = [...(post.comments || []), newComment];

      return this.httpClient.patch<IPosts>(`${environment.apiUrl}/posts/${postId}`, {
        comments: updatedComments
      });
    })
  );
}

generateRandomId(length: number = 6): string {
  return Math.random().toString(36).substr(2, length);
}

//update comment
UpdateComment(postId: string, commentId: string, updatedContent: string): Observable<IPosts> {
  return this.httpClient.get<IPosts>(`${environment.apiUrl}/posts/${postId}`).pipe(
    switchMap(post => {
      const updatedComments = post.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, body: updatedContent, isEditing: false };
        }
        return comment;
      });

      return this.httpClient.patch<IPosts>(`${environment.apiUrl}/posts/${postId}`, {
        comments: updatedComments
      });
    })
  );
}
//delete comment
DeleteComment(postId: string, commentId: string): Observable<IPosts> {
  return this.httpClient.get<IPosts>(`${environment.apiUrl}/posts/${postId}`).pipe(
    switchMap(post => {
      const updatedComments = post.comments.filter(comment => comment.id !== commentId);

      return this.httpClient.patch<IPosts>(`${environment.apiUrl}/posts/${postId}`, {
        comments: updatedComments
      });
    })
  );
}
}
