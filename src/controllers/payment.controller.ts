import { Request, Response, NextFunction } from 'express';
import PaymentService from '@services/payments.service';


// Define the PaymentController class
class PaymentController {


  public paymentService = new PaymentService();

    public handleBankTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { amount, user, cart,storeOwner  } = req.body;

      // Ensure customer object contains name and email
      if (!user || !user.name || !user.email) {
        res.status(400).json({ success: false, message: 'Customer name and email are required.' });
        return;
      }
      const products = Array.isArray(cart) ? cart : [cart];

      // Call the bankTransfer method from PaymentService
      const result = await this.paymentService.bankTransfer(amount, user, products, storeOwner);

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

 public getPayments = async(req: any, res: Response): Promise<Response> => {
  try {
    const payments = this.paymentService.getAllPayments();

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found" });
    }

    return res.status(200).json({ payments });
  } catch (error:any) {
    console.error('Error fetching payments:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

 // Webhook handler
public  webHookHandler = async(req: any, res: Response): Promise<Response | undefined> => {
   try {
      // Extract the event, data, and signature from the request
      const event = req.body.event;
      const data = req.body.data;
     const signature = req.headers['x-korapay-signature'] as string; // Korapay sends the signature in this header
    
       const actualSignature = signature?.replace('sha256=', '');

     console.log("myheqad", signature);
      // Call the webhook processing function in PaymentService
      const result = await this.paymentService.webHooksUrls(event, data, actualSignature);

      // Send the response based on the processing result
     return res.status(result.status).json(result);
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      res.status(500).json({
        status: 500,
        message: 'Failed to process webhook',
      });
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
