export type User = {
  id?: number;
  username: string;
  email: string;
  password: string;
  profile_image_url: string;
  created_at: Date;
  updated_at: Date;
};

export interface SeedData {
  users: User[];
}
