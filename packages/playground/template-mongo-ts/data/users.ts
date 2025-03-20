import { IUser } from "../models/User";

export const users: Partial<IUser>[] = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    password: "password123",
    name: "John Doe",
    bio: "Software developer with a passion for clean code",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "user",
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
    password: "password123",
    name: "Jane Smith",
    bio: "UX/UI designer and front-end developer",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "admin",
  },
  {
    username: "alex_johnson",
    email: "alex.johnson@example.com",
    password: "password123",
    name: "Alex Johnson",
    bio: "Full-stack developer with experience in MERN stack",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "user",
  },
  {
    username: "emily_wilson",
    email: "emily.wilson@example.com",
    password: "password123",
    name: "Emily Wilson",
    bio: "Backend developer specialized in Node.js and databases",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "user",
  },
  {
    username: "michael_brown",
    email: "michael.brown@example.com",
    password: "password123",
    name: "Michael Brown",
    bio: "DevOps engineer with a focus on automation",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    role: "user",
  },
];
