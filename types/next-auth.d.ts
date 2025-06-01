import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discord_id: string;
      username: string;
      avatar_url: string | null;
      role: 'admin' | 'user';
    };
  }

  interface User {
    id: string;
    discord_id: string;
    username: string;
    avatar_url: string | null;
    role: 'admin' | 'user';
  }
}
