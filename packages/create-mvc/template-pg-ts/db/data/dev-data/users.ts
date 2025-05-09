import { User } from "../../../types";

const users: User[] = [
  {
    username: "alice123",
    email: "alice@example.com",
    password: "hashed_password_1",
    profile_image_url: "https://example.com/alice.jpg",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    username: "bob123",
    email: "bob@example.com",
    password: "hashed_password_2",
    profile_image_url: "https://example.com/bob.jpg",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    username: "charlie123",
    email: "charlie@example.com",
    password: "hashed_password_3",
    profile_image_url: "https://example.com/charlie.jpg",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default users;
