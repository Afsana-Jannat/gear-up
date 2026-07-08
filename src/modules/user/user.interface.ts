export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;

  phone?: string;
  address?: string;
  avatar?: string;

  role: 'CUSTOMER' | 'PROVIDER';
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}
