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

class ProductService
{
    public users = userModel;
    public store = storeModel;
    public product = productStore;

    public async createProduct(productData: any, userId: string,file: any, storeId: string): Promise<Product>
    {
        if (!productData.name || !productData.description  || !productData.price || !productData.category) {
      throw new MainAppError({
        name: 'validationError',
        message: 'All fields (name, description,  price, category) are required',
        status: 400,
        isSuccess: false,
      });
    }
        
     const store = await storeModel.findOne({ _id: storeId, userId });

    if (!store) {
      throw new MainAppError({
        name: 'StoreNotFoundError',
        message: 'Store not found or you do not have permission to add products to this store.',
        status: 404,
        isSuccess: false,
      });
    }

    
        
     let image;
    if (file) {
      const uploadedImage = await cloudinary.uploader.upload(file.path);
      image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    } else {
      throw new MainAppError({
        name: 'imageError',
        message: 'Product image is required',
        status: 400,
        isSuccess: false,
      });
    }

    const createdProduct = await this.product.create({
      ...productData,
        storeId,
      image,
      createdBy: userId,
    });
    store.products.push(new mongoose.Types.ObjectId(`${createdProduct._id}`));
        
    await store.save(); 
           
    return createdProduct;;
        

    }
    
    public async getProductsByStore(storeId: string): Promise<Product[]> {
  // Check if the store exists
  const store = await storeModel.findById(storeId);

  if (!store) {
    throw new MainAppError({
      name: 'StoreNotFoundError',
      message: 'Store not found',
      status: 404,
      isSuccess: false,
    });
  }

  // Find products and populate related fields
  const products = await this.product
    .find({ storeId })
    .populate('storeId', 'storeName')  // Populating store information (selecting specific fields like name and location)
    .populate('createdBy', 'fullName email');  // Populating user who created the product (selecting fullName and email)

  if (!products || products.length === 0) {
    throw new MainAppError({
      name: 'NoProductsFound',
      message: 'No products found for this store',
      status: 404,
      isSuccess: false,
    });
  }

  return products;
}
    
}
 
export default ProductService;
