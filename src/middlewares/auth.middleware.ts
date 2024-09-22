import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/user.model';

const authMiddleware = async (req: any, res: Response, next: NextFunction) =>
{
     const Authorization = req.cookies?.['Authorization'] || 
        (req.headers['authorization'] ? req.headers['authorization'].split('Bearer ')[1] : null);

    
    // console.log("Authorization Header: ", req.header('Authorization'));
    // console.log("Extracted Token: ", Authorization);
        console.log(Authorization);
  try {
   

    if (Authorization) {
      const secretKey: string = SECRET_KEY as string;
      
      try {
        const verificationResponse =  verify(Authorization, secretKey) as DataStoredInToken;
        console.log("Decoded Token: ", verificationResponse);
        
        const userId = verificationResponse._id;
        const findUser = await userModel.findById(userId);
        console.log("User Found: ", findUser);

        if (findUser) {
          req.user = findUser;  // Attach user to the request
          next();
        } else {
          next(new HttpException(401, 'User not found for the provided token'));
        }
      } catch (error) {
        next(new HttpException(401, 'Invalid authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token pass'));
  }
};

export default authMiddleware;
