export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: string;
}

export interface CommentInput {
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
}