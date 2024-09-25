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
    this.router.post(`${this.path}create-payment`, this.paymentController.handleCardPaymentTest);
    // this.router.post(`${this.path}login`, this.authController.loginUser);
    // this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOutUser);
  }
}

export default PaymentRoutes;