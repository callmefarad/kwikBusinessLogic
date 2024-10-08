import { Document } from 'mongoose';
export interface User extends Document
{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'storeOwner';  // Added role field
    store?: string;  
}
