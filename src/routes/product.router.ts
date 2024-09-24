import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ProductController from '@controllers/product.controller';
import authMiddleware from '@middlewares/auth.middleware';
import upload from "../utils/multer"


class ProductRoutes implements Routes {
  public path = '/';
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}:storeId/create-store`,upload.single('image'),authMiddleware, this.productController.createProduct);
    this.router.get(`${this.path}stores/:storeId/products`, authMiddleware,this.productController.getProductsByStore);
    // this.router.post(`${this.path}logout`, this.authController.logOutUser);
  }
}

export default ProductRoutes;