import { Request, Response, NextFunction } from 'express';
import PaymentService from '@services/payments.service';

// Define the PaymentController class
class PaymentController {


  public paymentService = new PaymentService();
  // Method to handle card payment
  public handleCardPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { chargeData, amount, currency, reference, customer } = req.body;

      // Call the payWithCard method from PaymentService
      const result = await this.paymentService.payWithCardTest(chargeData, amount, currency, reference, customer);

      // Send the response back to the client
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
    };
    
     public handleCardPaymentTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, number, cvv, pin, expiry_year, expiry_month, amount, user } = req.body;

      // Call the payWithCard method from the PaymentService
      const result = await this.paymentService.payWithCard(
        { name, number, cvv, pin, expiry_year, expiry_month },
        amount,
        user
      );

      // Send the response back to the client
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  };
}

export default PaymentController;
