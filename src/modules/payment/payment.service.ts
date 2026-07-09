import { PaymentStatus } from '../../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { ICreatePayment } from './payment.interface';

const createPaymentIntoDB = async (
  customerId: string,
  payload: ICreatePayment
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: payload.rentalOrderId,
    },
    include: {
      payment: true,
    },
  });

  if (rental.customerId !== customerId) {
    throw new Error('You are not authorized.');
  }

  if (rental.payment) {
    throw new Error('Payment already exists.');
  }

  const payment = await prisma.payment.create({
    data: {
      transactionId: `TXN-${Date.now()}`,
      rentalOrderId: rental.id,
      amount: rental.totalAmount,
      method: payload.method,
      status: PaymentStatus.PENDING,
    },
  });

  return payment;
};

export const paymentService = {
  createPaymentIntoDB,
};
