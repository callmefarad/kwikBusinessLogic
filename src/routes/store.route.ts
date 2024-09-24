import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import StoreController from '@controllers/store.controller';
import authMiddleware from '@middlewares/auth.middleware';


class StoreRoutes implements Routes {
  public path = '/';
  public router = Router();
  public storeController = new StoreController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}create-store`,authMiddleware, this.storeController.createStore);
    this.router.get(`${this.path}store/get-single`, authMiddleware, this.storeController.getSingleStore);
    // this.router.post(`${this.path}logout`, this.authController.logOutUser);
  }
}

export default StoreRoutes;