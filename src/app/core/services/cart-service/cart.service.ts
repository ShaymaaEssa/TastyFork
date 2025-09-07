import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly ID = inject(PLATFORM_ID);
  private supabaseClient !: SupabaseClient;

  constructor() {
    if(isPlatformBrowser(this.ID)){
      this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
   }

  addItemToCart(clientID:string, itemID:string, quantity=1):Observable<any>{
    const {data, error} = await this.supabaseClient
                                .from('carts')
                                .select('id')
                                .eq('client_id', clientID)
                                .eq('status', 'active')
                                .single();

  }
}
