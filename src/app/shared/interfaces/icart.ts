import { IItems } from "./iitems";

export interface ICart {
    id: string;
  client_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ICartItem {
 id: string;              // cart_items.id
  cart_id: string;         // cart_items.cart_id
  item_id: string;         // cart_items.item_id
  quantity: number;        // cart_items.quantity
  name: string;            // items.name
  description: string;     // items.description
  price: number;           // items.price
  img_url: string;         // items.image_url
  cart_status: string;     // carts.status
  clientId: string;        // carts.client_id
}