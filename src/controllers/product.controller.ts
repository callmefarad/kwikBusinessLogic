import { Request, Response,NextFunction } from 'express';
import ProductService from '@services/product.service';



class classProductController {
    public product = new ProductService();

     public createProduct = async (req: any, res: Response,next: NextFunction): Promise<void> => {
        try {
            const { storeId } = req.params;
            
            const userId = req.user._id;  // Assuming req.user is populated after authentication
           
            const productData = req.body;
            const file = req.file;  // Assuming a single image file is uploaded
            

    // Call the service to create a product with the single image
    const product = await this.product.createProduct(productData, userId, file,  storeId);

     res.status(201).json({
  
      message: 'Product created successfully',
      data: product,
    });
        } catch (error) {
            next(error);
        }
    }

    public getProductsByStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { storeId } = req.params;

    const products = await this.product.getProductsByStore(storeId);

    res.status(200).json({
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
    
   

        
}

export default classProductController
