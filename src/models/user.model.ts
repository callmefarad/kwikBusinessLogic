import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/user.interface';
const userSchema: Schema = new Schema({

  firstName: {
    type: String,
    require: true,
    lowercase: true,
    
  },
  lastName: {
    type: String,
    require: true,
     lowercase: true,
   
  },
  email: {
    type: String,
    require: true,
    unique: true,
     lowercase: true,
  },
  password: {
    type: String,
    require: true,
    },
  role: { type: String, enum: ['user', 'storeOwner'], default: 'storeOwner', required: true },  // Role field
  store: { type: Schema.Types.ObjectId, ref: 'Store' },
});

const userModel = model<User & Document>('user', userSchema);

export default userModel;
