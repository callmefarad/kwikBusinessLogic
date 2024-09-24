export interface Image {
  url: string;        // URL of the image
  publicId: string;   // Public ID from Cloudinary
}



export interface Product
{
  _id: string;
  storeId: string;  // Reference to the Store
  name: string;
  price: number;
  description: string;
  productLink: string;  // Unique product link
  image: Image;  // URL of the product image
  category: string;  // String to represent category name
  createdBy: string;  
}