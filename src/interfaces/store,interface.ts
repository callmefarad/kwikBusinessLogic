export interface Store {
  _id: string;
  userId: string; // Reference to the User
  storeName: string;
  address: string; // Unique link for the store
  country: string;   
  products: string[]; // Array of product IDs or objects
}