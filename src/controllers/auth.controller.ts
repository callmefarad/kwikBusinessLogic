import { NextFunction, Request, Response } from 'express';
import AuthService from '@/services/auth.service';

import { User } from '@interfaces/user.interface';
import { RequestWithUser } from '@interfaces/auth.interface';


class classAuthController {
    public authServices = new AuthService();
    
    public signUpUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: any = req.body;
            const createUserData = await this.authServices.signup(userData);
            
           res.status(201).json({ 
            user: createUserData.user, // user data without password
            token: createUserData.token, // token for authentication
            message: 'User created successfully' 
        });
        } catch (error) {
            next(error);
        }
    }

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: any = req.body;
      const { token, findUser } = await this.authServices.login(userData);

        // Create cookie and set it in the response
        const cookie = this.authServices.createCookies({ token, expiresIn: 60 * 60 });
        res.setHeader('Set-Cookie', [cookie]);
        
        res.status(200).json({
            message: 'Login successfully',
            token, // Return the token in the response
            user: findUser,
        });
    } catch (error) {
      next(error);
    }
  };

  public logOutUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userData: User = req.user; 
        
        // Clear the cookie
        res.setHeader('Set-Cookie', ['Authorization=; Max-Age=0; Path=/; HttpOnly']);
        res.status(200).json({
            // data: userData, // Return user data if needed
            message: 'Logout successful',
        });
    } catch (error) {
        next(error);
    }
  };
}


export default classAuthController