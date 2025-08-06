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
  IsUpdated:boolean,
  comments:[{
    id: string,
    userId: string,
    body:string,
    likes: number,
    isEditing: boolean
  }]


}
