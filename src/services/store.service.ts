import { hash, compare } from 'bcrypt';
import userModel from '@models/user.model';
import storeModel from '@models/store.model';
import { MainAppError } from '@utils/errorDefinition';
import { isEmpty } from '@utils/util';
import { HTTP } from '@interfaces/error.interface';
import { User } from '@interfaces/user.interface';
import { Store } from '@interfaces/store.interface';
import { SECRET_KEY } from '@config';
import { sign } from 'jsonwebtoken';
import { TokenData, DataStoredInToken } from '@interfaces/auth.interface';

class StoreService
{
    public users = userModel;
    public store = storeModel;
    public async createStore(storeData: any, userId: string): Promise<Store>
    {
        if (!storeData.storeName || !storeData.address || !storeData.country) {
      throw new MainAppError({
        name: 'validationError',
        message: 'All fields (storeName, address, country) are required',
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });
        }
        
        const findUser: User | null = await this.users.findOne({ _id: userId });
    if (!findUser)
      throw new MainAppError({
        name: 'user not there',
        message: `this user does not exist`,
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });

    // Check if the store with the same storeName already exists for the user
    const existingStore = await this.store.findOne({ userId});
    if (existingStore) {
      throw new MainAppError({
        name: 'validationError',
        message: `User already have a store`,
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });
        }
        const createStoreData: Store = await this.store.create({
      ...storeData,
      userId,
      products: [], // Initially, no products are attached
        });
        
        return createStoreData;
        

     }
    
}
 
export default StoreService;
