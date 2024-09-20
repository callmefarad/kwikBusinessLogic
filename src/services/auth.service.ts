import { hash, compare } from 'bcrypt';
import userModel from '@models/user.model';
import { MainAppError } from '@utils/errorDefinition';
import { isEmpty } from '@utils/util';
import { HTTP } from '@interfaces/error.interface';
import { User } from '@interfaces/user.interface';
import { SECRET_KEY } from '@config';
import { sign } from 'jsonwebtoken';
import { TokenData, DataStoredInToken } from '@interfaces/auth.interface';
 
class AuthService
{
    public users = userModel;

    public async signup(userData:any):Promise<any>
    {
        if (isEmpty(userData.email) || isEmpty(userData.password))
      throw new MainAppError({
        name: 'validationError',
        message: 'all field is required',
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });
        
        const findUser: User | null = await this.users.findOne({ email: userData.email });
        if (findUser)
        throw new MainAppError({
            name: 'validationError',
            message: `this user ${userData.email} already exits`,
            status: HTTP.BAD_REQUEST,
            isSuccess: false,
        });
        
        const hashedPassword = await hash(userData.password, 10);
        const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
        const { password, ...userWithoutPassword } = createUserData.toObject(); 

        return userWithoutPassword;


        
    }

    public async login(userData: any): Promise<{ cookie: string; findUser: Omit<User, 'password'> }> {
    if (isEmpty(userData.email) || isEmpty(userData.password))
      throw new MainAppError({
        name: 'validationError',
        message: 'all field is required',
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });

    const findUser: User | null = await this.users.findOne({ email: userData.email });
    if (!findUser)
      throw new MainAppError({
        name: 'user not there',
        message: `this ${userData.email} was not found`,
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });

    const isMatchingPassword: boolean = await compare(userData.password, findUser.password);
    if (!isMatchingPassword)
      throw new MainAppError({
        name: ' Incorrect  Password',
        message: `password did not match`,
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookies(tokenData);
    const { password, ...userWithoutPassword } = findUser.toObject(); // Convert to plain object
    return { cookie, findUser:userWithoutPassword };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData.email) || isEmpty(userData.password))
      throw new MainAppError({
        name: 'validationError',
        message: 'all field is required',
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });

    const findUser: User | null = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) {
      throw new MainAppError({
        name: 'validationError',
        message: `this ${userData.email} was not found`,
        status: HTTP.BAD_REQUEST,
        isSuccess: false,
      });
    }
    return findUser;
  }

  

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey = SECRET_KEY as string;
    const expiresIn = 60 * 60;
    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookies(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
    
}

export default AuthService;