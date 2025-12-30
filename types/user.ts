export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface RecipientProfile {
  id: string;
  userId: string;
  name: string;
  relationship?: string;
  ageRange?: string;
  gender?: string;
  description?: string;
  interests?: string[];
  likes?: string[];
  dislikes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

