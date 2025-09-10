import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, Signal, signal, WritableSignal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartNumber:WritableSignal<number> = signal(0);

  private readonly ID = inject(PLATFORM_ID);
  private supabaseClient !: SupabaseClient;

  constructor() {
    if(isPlatformBrowser(this.ID)){
      this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
   }



  addItemToCart(clientID:Signal<string|undefined>, itemID:string, quantity=1):Observable<any>{

    return from(this.addItemToCartLogic(clientID, itemID, quantity));
  }

  private async addItemToCartLogic(clientID:Signal<string|undefined>, itemID:string, quantity=1):Promise<any>{

    try{
      let cartId : string ;
      let newCart : boolean = false;



      //check the client ID
      console.log(`Client ID: ${clientID}`);


      //check if the client has an active cart
      const {data:cartData, error:cartError} = await this.supabaseClient
                                .from('carts')
                                .select('id')
                                .eq('client_id', clientID)
                                .eq('status', 'active')
                                .single();
                                

      //if client doesn't have active cart, create a new one
      if(!cartData || cartError){
        const {data:newCartData, error:newCartError} = await this.supabaseClient
                                                      .from ('carts')
                                                      .insert({
                                                        client_id:clientID, 
                                                        status:'active'
                                                      })
                                                      .select('id')
                                                      .single();

        if(newCartError){
          throw new Error(`Failed to create cart: ${newCartError.message}`);
        }

        cartId = newCartData.id;
        newCart = true;

      }
      //client already has an active cart
      else {
        cartId = cartData.id;
        newCart = false;
      }


      
      if (!newCart){

        //check if the item already in the active cart
        const {data: existingItem, error:existingItemeError} = await this.supabaseClient
                                                              .from('cart_items')
                                                              .select('id, quantity')
                                                              .eq('cart_id', cartId)
                                                              .eq('item_id', itemID)
                                                              .single();

        if(existingItemeError && existingItemeError.code !=='PGRST116'){
           // PGRST116 is "no rows returned"
          throw new Error(`Failed to check cart items: ${existingItemeError.message}`);

        }

        if(existingItem){
          const {error:updateQuantityError} = await this.supabaseClient
                                              .from ('cart_items')
                                              .update({quantity:existingItem.quantity + quantity})
                                              .eq('id', existingItem.id);

          if(updateQuantityError){
            throw new Error (`Failed to update cart item: ${updateQuantityError.message}`);
          }

          return {success:true, action:'item quantity updated in the cart', cartId}
      } else {
        //this item not in the current cart so add it
        const {error:insertItemError} = await this.supabaseClient
                                        .from ('cart_items')
                                        .insert({
                                          cart_id : cartId, 
                                          item_id: itemID, 
                                          quantity: quantity
                                        });

        if(insertItemError){
          throw new Error (`Failed to add item to the cart: ${insertItemError.message}`);
        }

        return {sucess:true, action:'item added to the cart', cartId};
      }

    } else {
      //new cart created
      const {error:insertItemError} = await this.supabaseClient
                                        .from ('cart_items')
                                        .insert({
                                          cart_id : cartId, 
                                          item_id: itemID, 
                                          quantity: quantity
                                        });

        if(insertItemError){
          throw new Error (`Failed to add item to the cart: ${insertItemError.message}`);
        }

        return {sucess:true, action:'item added to the cart', cartId};



    }
        

        
  } catch(error){
    console.log('Error in add to cart logic: ', error);
    throw error;
  }
}

}
