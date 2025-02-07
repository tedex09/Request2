export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  whatsapp?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  _id: string;
  userId: string;
  type: "add" | "update" | "fix";
  mediaId: number;
  mediaType: "movie" | "tv";
  status: "pending" | "in_progress" | "completed" | "rejected";
  description?: string;
  notifyWhatsapp: boolean;
  createdAt: Date;
  updatedAt: Date;
}