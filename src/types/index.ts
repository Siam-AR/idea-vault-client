export interface User {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  id?: string;
  text?: string;
  content?: string;
  ideaId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  user?: User;
  idea?: {
    _id: string;
    title?: string;
    category?: string;
    authorName?: string;
  };
  ideaTitle?: string;
  ideaCategory?: string;
  ideaAuthorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Idea {
  _id: string;
  id?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  detailedDescription?: string;
  fullDescription?: string;
  category?: string;
  tags?: string[] | string;
  imageURL?: string;
  location?: string;
  supportNeeded?: string;
  priority?: string;
  estimatedBudget?: number | string;
  targetAudience?: string;
  problemStatement?: string;
  proposedSolution?: string;
  likes?: number | string[];
  userName?: string;
  userEmail?: string;
  author?: User;
  authorId?: string;
  comments?: Comment[];
  commentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: User;
  success?: boolean;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
}
