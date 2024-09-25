import { hash, compare } from 'bcrypt';
import userModel from '@models/user.model';
import storeModel from '@models/store.model';
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


class PaymentService {
  public async bankTransfer(accountName: string, amount: number, currency: string, reference: string, 
    customer: { name: string, email: string }
  ): Promise<any> {
    try {
      const data = {
        account_name: accountName,
        amount: amount,
        currency: currency,
        reference: reference,
        customer: {
          name: customer.name,
          email: customer.email,
        },
      };

      const config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.korapay.com/merchant/api/v1/charges/bank-transfer',
        headers: {
          'Content-Type': 'application/json', // Make sure you're sending JSON
          'Authorization': `Bearer ${KORAPAY_API_KEY}`, // Replace with your API key
        },
        data: JSON.stringify(data),
      };

      const response = await axios(config);
      return response.data; // Return the response for further processing
    } catch (error:any) {
      console.error('Error during bank transfer:', error.message);
      throw new Error('Failed to process the bank transfer');
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
    user: { name: string; email: string })
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
        message: 'Transaction not failed',
        status: 404,
        isSuccess: false,
      });
    })

    return   JSON.parse(JSON.stringify(paymemtresponse?.data))
  } 


  public async payWithCardTest(
    chargeData: string, // The encrypted card data or payment token
    amount: number, 
    currency: string, 
    reference: string, 
    customer: { name: string, email: string }
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




