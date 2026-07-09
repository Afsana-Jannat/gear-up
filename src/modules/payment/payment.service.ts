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

  if (rental.status === 'CANCELLED') {
    throw new Error('Cannot pay for cancelled rental.');
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

const confirmPaymentIntoDB = async (paymentId: string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      id: paymentId,
    },
  });
  if (payment.status === PaymentStatus.COMPLETED) {
    throw new Error('Payment already confirmed.');
  }

  if (payment.status === PaymentStatus.FAILED) {
    throw new Error('Failed payment cannot be confirmed.');
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
    },
  });

  await prisma.rentalOrder.update({
    where: {
      id: payment.rentalOrderId,
    },
    data: {
      status: 'PAID',
    },
  });

  return updatedPayment;
};

const getMyPaymentsFromDB = async (customerId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId,
      },
    },
    include: {
      rentalOrder: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getSinglePaymentFromDB = async (id: string, customerId: string) => {
  return prisma.payment.findFirstOrThrow({
    where: {
      id,
      rentalOrder: {
        customerId,
      },
    },
    include: {
      rentalOrder: true,
    },
  });
};

export const paymentService = {
  createPaymentIntoDB,
  confirmPaymentIntoDB,
  getMyPaymentsFromDB,
  getSinglePaymentFromDB,
};
