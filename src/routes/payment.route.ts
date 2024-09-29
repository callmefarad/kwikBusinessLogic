import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PaymentController from '@controllers/payment.controller';
import authMiddleware from '@middlewares/auth.middleware';


class PaymentRoutes implements Routes {
  public path = '/';
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}card-payment`, this.paymentController.handleCardPaymentTest);
    this.router.get(`${this.path}:storeId/purchase`, this.paymentController.getPurchaseByStore);
    this.router.post(`${this.path}create-bank-payment`, this.paymentController.handleBankTransfer);
    this.router.post(`${this.path}webhook`, this.paymentController.webHookHandler);
    this.router.get(`${this.path}payments`, this.paymentController.getPayments);
    this.router.post(`${this.path}create-purchase`, this.paymentController.createPurchase);
    // this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOutUser);
  }
}

export default PaymentRoutes;