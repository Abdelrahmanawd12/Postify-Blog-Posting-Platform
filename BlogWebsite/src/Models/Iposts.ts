export interface IPosts {
  id: string;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: string;
 imageUrl:string;
  IsUpdated:boolean


}
