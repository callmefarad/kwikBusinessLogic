import { model, Schema, Document } from 'mongoose';
import { Product } from '@interfaces/product.interface';

const productSchema: Schema = new Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store', // Reference to the Store model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    },
  image: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  productLink: {
    type: String,
    unique: true, // Ensure the product link is unique
    },
   createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',  // Reference to the user who created the product
      required: true,
    },
}, { timestamps: true });

// Pre-save middleware to generate product link
productSchema.pre('save', function(next) {
  if (!this.productLink) {
    // Generate a unique product link by appending the product name and storeId
    this.productLink = `http://localhost:3000/product/${(this.name as string).replace(/\s+/g, '-').toLowerCase()}-${this.storeId}`;
  }
  next();
});

const productModel = model<Product & Document>('products', productSchema);

export default productModel;
