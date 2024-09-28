import { Request, Response, NextFunction } from 'express';
import PaymentService from '@services/payments.service';


// Define the PaymentController class
class PaymentController {


  public paymentService = new PaymentService();

    public handleBankTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { amount, customer } = req.body;

      // Ensure customer object contains name and email
      if (!customer || !customer.name || !customer.email) {
        res.status(400).json({ success: false, message: 'Customer name and email are required.' });
        return;
      }

      // Call the bankTransfer method from PaymentService
      const result = await this.paymentService.bankTransfer(amount, customer);

      // Send success response to client
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  };

  // Method to handle card payment
  // public handleCardPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const { chargeData, amount, currency, reference, customer } = req.body;

  //     // // Call the payWithCard method from PaymentService
  //     // const result = await this.paymentService.payWithCardTest(chargeData, amount, currency, reference, customer);

  //     // // Send the response back to the client
  //     // res.status(200).json({ success: true, data: result });
  //   } catch (error) {
  //     next(error); // Pass the error to the error handling middleware
  //   }
  //   };

  

  public  getPurchaseByStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try
     {
       const { storeId } = req.params;
      const purchases = await this.paymentService.getPurchasesByStoreId(storeId);

       res.status(200).json({
        message: 'Purchases retrieved successfully',
        isSuccess: true,
        data: purchases,
      });
    } catch (error:any) {
         res.status(404).json({
        message:`ops ${error.message}`,
        isSuccess: false,
      });
    }
  }

   public getPayments = async(req: Request, res: Response): Promise<void> =>{
        try {
            const payments = await this.paymentService.getPayments();
             res.json(payments);
        } catch (error:any) {
            console.error('Error fetching payments:', error.message);
               res.status(500).json({ message: error.message });
        }
    }

 // Webhook handler
public  webHookHandler = async(req: any, res: Response): Promise<Response> => {
   console.log('Request Headers:', req.headers); // Log all headers
    const { event, data } = req.body; // Destructure the event and data from the request body
    const signature = req.headers['x-korapay-signature'] as string;

    if (!signature) {
        console.warn('Received signature is undefined');
        return res.status(403).json({ message: 'No signature provided' });
    }


    try {
        // Process the event based on its type
        const result = await this.paymentService.webHooksUrls(event, data, signature);
        return res.status(result.status).json({ message: result.message, payment: result.payment });
    } catch (error:any) {
        console.error('Error in webhook controller:', error.message);
        return res.status(500).json({ message: error.message });
    }
}
    
     public handleCardPaymentTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, number, cvv, pin, expiry_year, expiry_month, amount, user,  cart,
        storeOwner } = req.body;
      
      const products = Array.isArray(cart) ? cart : [cart];

      // Call the payWithCard method from the PaymentService
      const result = await this.paymentService.payWithCard(
        { name, number, cvv, pin, expiry_year, expiry_month },
        amount,
        user,
        products,
        storeOwner  
      );

      // Send the response back to the client
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  };
}

export default PaymentController;
