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

export type CreateOrderRequest = {
  serviceId: string;
  [questionId: string]: string;
};
