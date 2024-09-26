import mongoose, { Schema, Document } from 'mongoose';

// Define the product sub-schema
const ProductSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Define the purchase schema
const PurchaseSchema = new Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  storeOwner: {
    // name: { type: String, required: true },
    storeId: { type: String, required: true },
  },
  products: [ProductSchema],  // Array of products
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const PurchaseModel = mongoose.model<Document>('Purchase', PurchaseSchema);

export default PurchaseModel;
