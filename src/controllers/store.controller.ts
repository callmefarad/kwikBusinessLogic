import { NextFunction, Request, Response } from 'express';
import AuthService from '@/services/auth.service';
import StoreService from '@/services/store.service';
import { User } from '@interfaces/user.interface';
import { RequestWithUser } from '@interfaces/auth.interface';


class classAuthController {
    public authServices = new AuthService();
    public storeService = new StoreService();
    
    public createStore = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user._id; // User is attached to the request from auth 
            // const userId = "66eed91b2c4082e112a77432";
            const storeData = req.body;
            
          const newStore = await this.storeService.createStore(storeData, userId);
            res.status(201).json({
            message: 'Store created successfully',
            store: newStore,
            });
        } catch (error) {
            next(error);
        }
    }

    public getSingleStore = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
   const userId = req.user._id;  // Assuming req.user is populated after authentication middleware

      const store = await this.storeService.getSingleStore(userId);

      if (!store) {
        res.status(404).json({ message: 'Store not found' });
      }

      res.status(200).json({
        message: 'Store fetched successfully',
        data: store,
      });
  } catch (error) {
    next(error);
  }
};


   
}


export default classAuthController