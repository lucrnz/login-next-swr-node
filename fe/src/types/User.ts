export type UserWithPassword = {
  id: number;
  username: string;
  password: string;
};

export type User = Omit<UserWithPassword, "password">;
