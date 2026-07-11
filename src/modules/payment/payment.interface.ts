import { PaymentMethod } from '@prisma/client';

export interface ICreatePayment {
  rentalOrderId: string;
  method: PaymentMethod;
}
