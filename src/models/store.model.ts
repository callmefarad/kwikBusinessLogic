import { model, Schema, Document } from 'mongoose';
import { Store } from '@interfaces/store.interface';

const storeSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',  // Reference to the User
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    
    
  },
  country: {
    type: String,
    required: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'product',  // Assuming 'product' model exists
  }],
  storeLink: {
    type: String,
    unique: true,  // Ensure the store link is unique
  },
}, { timestamps: true });

// Pre-save middleware to generate store link
storeSchema.pre('save', function(next) {
  if (!this.storeLink) {
    // Generate a unique store link by appending the userId
    this.storeLink = `http://localhost:3000/store/${(this.storeName as string).replace(/\s+/g, '-').toLowerCase()}-${this.userId}`;
  }
  next();
});

const storeModel = model<Store & Document>('Store', storeSchema);

export default storeModel;
