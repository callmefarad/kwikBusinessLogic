import { NextFunction, Request, Response } from 'express';
import AuthService from '@/services/auth.service';

import { User } from '@interfaces/user.interface';
import { RequestWithUser } from '@interfaces/auth.interface';


class classAuthController {
    public authServices = new AuthService();
    
    public signUpUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: any = req.body;
            const createUserData: User = await this.authServices.signup(userData);
            
            res.status(201).json({ data: createUserData, message: 'created' });
        } catch (error) {
            next(error);
        }
    }

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: any = req.body;
      const { cookie, findUser } = await this.authServices.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        message: 'login successfully',
        data: findUser,
      });
    } catch (error) {
      next(error);
    }
  };

  public logOutUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authServices.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}


export default classAuthController