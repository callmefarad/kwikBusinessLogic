import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AuthController from '@controllers/auth.controller';


class AuthRoutes implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, this.authController.signUpUser);
    this.router.post(`${this.path}login`, this.authController.loginUser);
    // this.router.post(`${this.path}logout`, this.authController.logOutUser);
  }
}

export default AuthRoutes;