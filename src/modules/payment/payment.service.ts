import { stripe } from '../../lib/stripe';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import { ICreatePayment } from './payment.interface';
import { PaymentStatus } from '../../../generated/prisma';

const createPaymentIntoDB = async (
  customerId: string,
  payload: ICreatePayment
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: payload.rentalOrderId,
    },
    include: {
      gear: true,
      payment: true,
    },
  });

  if (rental.customerId !== customerId) {
    throw new Error('You are not authorized.');
  }

  if (rental.payment) {
    if (rental.payment.status === PaymentStatus.COMPLETED) {
      throw new Error('Payment already completed.');
    }

    await prisma.payment.delete({
      where: {
        id: rental.payment.id,
      },
    });
  }

  if (rental.status === 'CANCELLED') {
    throw new Error('Cannot pay for cancelled rental.');
  }

  if (rental.status === 'PAID') {
    throw new Error('Rental already paid.');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',

    payment_method_types: ['card'],

    line_items: [
      {
        price_data: {
          currency: 'bdt',

          product_data: {
            name: rental.gear.name,
            description: rental.gear.description,
          },

          unit_amount: Number(rental.totalAmount) * 100,
        },

        quantity: 1,
      },
    ],

    success_url: `${config.app_url}api/payments/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.app_url}api/payments/cancel`,

    metadata: {
      rentalOrderId: rental.id,
      customerId,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      transactionId: session.id,
      rentalOrderId: rental.id,
      amount: rental.totalAmount,
      method: payload.method,
      status: PaymentStatus.PENDING,
    },
  });

  return {
    payment,
    checkoutUrl: session.url,
  };
};

// const confirmPaymentIntoDB = async (paymentId: string) => {
//   const payment = await prisma.payment.findUniqueOrThrow({
//     where: {
//       id: paymentId,
//     },
//   });
//   if (payment.status === PaymentStatus.COMPLETED) {
//     throw new Error('Payment already confirmed.');
//   }

//   if (payment.status === PaymentStatus.FAILED) {
//     throw new Error('Failed payment cannot be confirmed.');
//   }

//   const updatedPayment = await prisma.payment.update({
//     where: {
//       id: paymentId,
//     },
//     data: {
//       status: PaymentStatus.COMPLETED,
//       paidAt: new Date(),
//     },
//   });

//   await prisma.rentalOrder.update({
//     where: {
//       id: payment.rentalOrderId,
//     },
//     data: {
//       status: 'PAID',
//     },
//   });

//   return updatedPayment;
// };

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

const paymentSuccessIntoDB = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed.');
  }

  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      transactionId: session.id,
    },
  });

  if (payment.status === PaymentStatus.COMPLETED) {
    return payment;
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      id: payment.id,
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

const paymentCancel = async () => {
  return {
    message: 'Payment cancelled.',
  };
};

export const paymentService = {
  createPaymentIntoDB,
  // confirmPaymentIntoDB,
  getMyPaymentsFromDB,
  getSinglePaymentFromDB,
  paymentSuccessIntoDB,
  paymentCancel,
};
