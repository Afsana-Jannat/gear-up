import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { paymentService } from './payment.service.js';
import { stripe } from '../../lib/stripe.js';
import config from '../../config/index.js';

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;

    const result = await paymentService.createPaymentIntoDB(
      customerId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Payment created successfully',
      data: result,
    });
  }
);

// const confirmPayment = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = await paymentService.confirmPaymentIntoDB(
//       req.params.id as string
//     );

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'Payment confirmed successfully',
//       data: result,
//     });
//   }
// );

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;

    const result = await paymentService.getMyPaymentsFromDB(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payments   successfully',
      data: result,
    });
  }
);

const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;

    const result = await paymentService.getSinglePaymentFromDB(
      req.params.id as string,
      customerId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment   successfully',
      data: result,
    });
  }
);

const paymentSuccess = catchAsync(async (req, res) => {
  const sessionId = req.query.session_id as string;

  const result = await paymentService.paymentSuccessIntoDB(sessionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment completed successfully',
    data: result,
  });
});

const stripeWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe_webhook_secret!
    );
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Webhook signature verification failed',
    });

    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    await paymentService.handleStripeWebhook(session.id);
  }

  res.status(200).json({
    success: true,
    message: 'Webhook received',
  });
});
const paymentCancel = catchAsync(async (req, res) => {
  const result = await paymentService.paymentCancel();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

export const paymentController = {
  createPayment,
  getMyPayments,
  getSinglePayment,
  paymentSuccess,
  paymentCancel,
  stripeWebhook,
};
