export type RegisterUser = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
