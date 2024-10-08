import { hash, compare } from 'bcrypt';
import userModel from '@models/user.model';
import storeModel from '@models/store.model';
import purchaseModel from '@models/purchase.model';
import { MainAppError } from '@utils/errorDefinition';
import { isEmpty } from '@utils/util';
import { HTTP } from '@interfaces/error.interface';
import { User } from '@interfaces/user.interface';
import { Store } from '@interfaces/store.interface';
import productStore from "@models/product.model"
import cloudinary from "@utils/cloudinary"
import { SECRET_KEY } from '@config';
import mongoose, { AnyKeys } from "mongoose"
import { sign } from 'jsonwebtoken';
import { TokenData, DataStoredInToken } from '@interfaces/auth.interface';
import { Product } from '@interfaces/product.interface';
import axios, { AxiosRequestConfig } from 'axios';
import crypto from "crypto";
import { uuid } from "uuidv4";

const  KORAPAY_API_KEY="sk_test_gQgnz1uGmqF5ckpKBtqFs9SXTM9CeY42TMyfY6SR"

const encrypt ="xQprX4eJNkZkCipZkdRPjS8BaRP2JLQf"

function encryptAES256(encryptionKey: string, paymentData: any) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
  const encrypted = cipher.update(paymentData);

  const ivToHex = iv.toString("hex");
  const encryptedToHex = Buffer.concat([encrypted, cipher.final()]).toString(
    "hex"
  );

  return `${ivToHex}:${encryptedToHex}:${cipher.getAuthTag().toString("hex")}`;
}

interface PaymentData {
    reference: string;
    amount: number;
    status: string;
    customer: any; // Adjust type based on your customer data structure
}


class PaymentService
{
  
   private payments: PaymentData[] = []; 
 public async bankTransfer(
  amount: number,
  user: { name: string; email: string },
): Promise<any> {
  try {
    const GenerateTransactionReference = uuid();
    
    const data = {
      account_name: "kwik store account",
      amount: amount,
      currency: "NGN",
      reference: GenerateTransactionReference,
      customer: {
        name: user.name,
        email: user.email,
      },
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: 'https://api.korapay.com/merchant/api/v1/charges/bank-transfer',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KORAPAY_API_KEY}`, // Use your actual API key here
      },
      data: JSON.stringify(data),
    };

    let paymentResponse: any;

    await axios(config).then(async function (response) {
      paymentResponse = response;
    }).catch(function (error) {
      throw new MainAppError({
        name: 'Failed transaction',
        message: `Transaction failed: ${error.message}`,
        status: 404,
        isSuccess: false,
      });
    });

    return JSON.parse(JSON.stringify(paymentResponse?.data));
  } catch (error: any) {
    console.error('Error during bank transfer:', error.message);
    throw new Error(`Failed to process the bank transfer: ${error.message}`);
  }
  }
  
  
  public async createPurchase(
    user: { name: string; email: string; address: string },
    products: Array<{ productId: string; productName: string; quantity: number; price: number }>,
    amount: number,
    storeOwner: { storeId: string }
  ): Promise<any> {
    try {
      // Create a new purchase document
      const purchase = new purchaseModel({
        customer: {
          name: user.name,
          email: user.email,
          address: user.address,
        },
        storeOwner: {
          storeId: storeOwner.storeId,
        },
        products: products.map((product) => ({
          productId: product.productId,
          productName: product.productName,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: amount,
        paymentStatus: 'paid', // This can be updated based on actual payment status
      });

      // Save the purchase in the database
      await purchase.save();
      return purchase;
    } catch (error: any) {
      console.error('Error creating purchase:', error.message);
      throw new Error(`Failed to create purchase: ${error.message}`);
    }
  }

public addPayment(payment: PaymentData): void {
    this.payments.push(payment);
  }

  // Fetch all payments
  public getAllPayments(): PaymentData[] {
    return this.payments;
  }

  // Main webhook handling function
  public async webHooksUrls(event: string, data: any, signature: string) {
    // Step 1: Validate the signature first
    const validationResponse = this.validateSignature(data, signature);
    if (!validationResponse.valid) {
      console.warn("Invalid signature received");
      return { status: 403, message: "Invalid signature" };
    }

    // Step 2: Process the webhook event and data
    return this.processEvent(event, data);
  }

  // Helper function for validating webhook signature
  private validateSignature(data: any, signature: string): { valid: boolean; computedHash?: string } {
    const secretKey = KORAPAY_API_KEY as string;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(JSON.stringify(data))  // Validate ONLY the `data` object
      .digest("hex");

    console.log("Computed HMAC:", hash);
    console.log("Received signature:", signature);

    if (hash !== signature) {
      return { valid: false };
    }

    return { valid: true, computedHash: hash };
  }

  // Helper function for processing webhook events
  private processEvent(event: string, data: any) {
    const paymentData: PaymentData = {
      reference: data.reference,
      amount: data.amount,
      status: data.status,
      customer: data.customer,
    };

    console.log("Received webhook event:", event, "with data:", paymentData);

    switch (event) {
      case "charge.success":
      case "transfer.success":
        console.log("Adding payment data to array", paymentData);
        this.addPayment(paymentData);
        return {
          status: 200,
          message: "Webhook processed successfully",
          payment: paymentData,
        };

      case "charge.failed":
      case "transfer.failed":
        console.log("Transaction failed", paymentData);
        return { status: 200, message: "Transaction failed", payment: paymentData };

      default:
        console.warn("Unhandled event received");
        return { status: 400, message: "Unhandled event" };
    }
  }


  public async payWithCard( cardData: {
      name: string;
      number: string;
      cvv: string;
      pin: string;
      expiry_year: string;
      expiry_month: string;
    },
    amount: number,
    user: { name: string; email: string, address:string },
    products: Array<{ productId: string; productName: string; quantity: number; price: number }>,
    storeOwner: { name: string; storeId: string }
  
  )
  {

    const GenerateTransactionReference = uuid();
      const paymentData = {
        reference: GenerateTransactionReference,
        card: {
          name: cardData.name,
          number: cardData.number,
          cvv: cardData.cvv,
          pin: cardData.pin,
          expiry_year: cardData.expiry_year,
          expiry_month: cardData.expiry_month,
        },
        amount,
        currency: "NGN",
        redirect_url: "https://merchant-redirect-url.com",
        customer: {
          name: user?.name,
          email: user?.email,
        },
        metadata: {
          internalRef: "JD-12-67",
          age: 15,
          fixed: true,
        },
      };

         const stringData = JSON.stringify(paymentData);
      //The data should be in buffer form according to Kora's pay
      const bufData = Buffer.from(stringData, "utf-8");
      const encryptedData = encryptAES256(encrypt, bufData);

    
     var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.korapay.com/merchant/api/v1/charges/card",
        headers: {
          Authorization: `Bearer ${KORAPAY_API_KEY}`,
        },
        data: {
          charge_data: `${encryptedData}`,
        },
    };
    
    let paymemtresponse:any ; 

    await axios(config).then(async function (response)
    { 
      paymemtresponse = response

    }).catch(function (error)
    {
      throw new MainAppError({
        name: 'Failed transaction',
        message: `Transaction not failed ${error.message}` ,
        status: 404,
        isSuccess: false,
      });
    })
    const check = JSON.parse(JSON.stringify(paymemtresponse?.data))
    
    console.log("djc", check)

    if (check?.data?.status === "success") {
    try {
      const purchase = new purchaseModel({
        customer: {
          name: user?.name,
          email: user?.email,
          address: user?.address
        },
        storeOwner: {
          // name: storeOwner?.name,
          storeId: storeOwner?.storeId,
        },
        products: products.map((product) => ({
          productId: product.productId,
          productName: product.productName,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: amount,
        paymentStatus: "paid", // Mark as paid after successful transaction
      });

      await purchase.save(); // Save the purchase details
    } catch (error) {
      console.error("Error saving purchase details:", error);
      throw new MainAppError({
        name: 'Database error',
        message: `Failed to save purchase details: ${error}`,
        status: 500,
        isSuccess: false,
      });
    }
  }


    return   JSON.parse(JSON.stringify(paymemtresponse?.data))
  } 

  public async getPurchasesByStoreId(storeId: string) {
    try {
      const purchases = await purchaseModel.find({ 'storeOwner.storeId': storeId });

      if (!purchases || purchases.length === 0) {
        throw new Error('No purchases found for this store');
      }

      return purchases;
    } catch (error:any) {
      throw new Error(error.message || 'Error retrieving purchases');
    }
  }


  public async payWithCardTest(
    chargeData: string, // The encrypted card data or payment token
    amount: number, 
    currency: string, 
    reference: string, 
    customer: { name: string, email: string, address:string },
    products: Array<{ productId: string; productName: string; quantity: number; price: number }>,
    storeOwner: { name: string; storeId: string }
  ): Promise<any> {
    try {
      // Prepare the data for the card charge
      const data = {
        charge_data: chargeData,
        amount: amount,
        currency: currency,
        reference: reference,
        customer: {
          name: customer.name,
          email: customer.email,
        },
      };

      // Configure the Axios request
      const config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.korapay.com/merchant/api/v1/charges/card',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KORAPAY_API_KEY}`, // Use the API key for authorization
        },
        data: JSON.stringify(data),
      };

      // Make the request and return the response
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      console.error('Error during card payment:', error.message);
      throw new Error('Failed to process the card payment');
    }
  }
}

export default PaymentService;




