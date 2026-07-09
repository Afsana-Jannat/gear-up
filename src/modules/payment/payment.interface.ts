import { PaymentMethod } from '../../../generated/prisma';

export interface ICreatePayment {
  rentalOrderId: string;
  method: PaymentMethod;
}
