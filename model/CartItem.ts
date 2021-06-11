import { ObjectId } from "mongodb";

export default interface CartItem{
    _id?: ObjectId;
    product: string;
    price: number;
    quantity: number;
}