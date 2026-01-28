export type AuthType = {
  username: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  user: {
    id: string | number;
    username: string;
  };
};

export type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
};

export type InvoiceType = {
  customer: string;
  date: string;
  dueDate: string;
  description: string;
  items: ItemType[];
};

type ItemType = {
  item: string;
  qty: string;
  price: number;
};

export type GetInvoicesResponse = {
message: string
user: unknown
invoices: InvoiceType[]
}