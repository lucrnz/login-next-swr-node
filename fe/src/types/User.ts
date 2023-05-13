export type UserWithPassword = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type User = Omit<UserWithPassword, "password">;
