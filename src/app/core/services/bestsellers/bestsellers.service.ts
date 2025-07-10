import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environment/environment';
import { from, map, Observable } from 'rxjs';
import { IItems } from '../../../shared/interfaces/iitems';

@Injectable({
  providedIn: 'root'
})
export class BestsellersService {

  private readonly id  = inject(PLATFORM_ID);
  private readonly supabaseClient !:SupabaseClient;

  constructor() { 
    if(isPlatformBrowser(this.id)){
      this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
  }

  getBestSellers():Observable<IItems[]>{
    return from (this.supabaseClient.from ('items')
                                    .select('id, name, description, price, image_url')
                                    .in('simple_id', [1, 7, 14, 37, 38, 39])) 
                .pipe(map((response)=>{
                  if(response.error){
                    throw response.error;
                  } 
                  return response.data as IItems[]

                }))
  }
}
