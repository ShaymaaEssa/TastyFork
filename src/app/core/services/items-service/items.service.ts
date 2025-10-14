import { error } from 'console';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environment/environment';
import {  map, Observable, switchMap, catchError, from } from 'rxjs';
import { IItems } from '../../../shared/interfaces/iitems';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private readonly id = inject(PLATFORM_ID);
  private readonly supabaseClient !: SupabaseClient;

  constructor() {
    if (isPlatformBrowser(this.id)) {
      this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
  }

  getBestSellers(): Observable<IItems[]> {
    return from(this.supabaseClient.from('items')
      .select('id, name, description, price, image_url, is_active, category_id, categories!inner(name), simple_id')
      .in('simple_id', [1, 7, 14, 37, 38, 39]))
      .pipe(map((response) => {
        if (response.error) {
          throw response.error;
        }
        const itemsWithCategory: IItems[] = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          is_active: item.is_active,
          category_id: item.category_id,
          category_name: item.categories.name,
          simple_id: item.simple_id
        }));

        return itemsWithCategory;

      }))
  }


  getBestDeals(): Observable<IItems[]> {
    return from(this.supabaseClient.from("items")
      .select('id, name, description, price, image_url, is_active, category_id, categories!inner(name), simple_id')
      .eq('is_active', 1)
      .order('id', { ascending: false }) // just recent items
      .limit(10))
      .pipe(map((response) => {
        if (response.error) {
          throw response.error;
        }
        const itemsWithCategory: IItems[] = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          is_active: item.is_active,
          category_id: item.category_id,
          category_name: item.categories.name,
          simple_id: item.simple_id
        }));

        return itemsWithCategory;

      }))

  }


  // getItemDetail(id: string): Observable<IItems> {
  //   return from(

  //     this.supabaseClient.from('items')
  //       .select()
  //       .eq('id', id)
  //       .single()
  //   ).pipe(switchMap(response => {
  //     const item = response.data;
      
  //   }));



  // }

  async getItemDetailSimple(id:string):Promise<IItems>{
    try{
      //get item details
      const {data:itemDetail, error:itemDetailError} = await this.supabaseClient
                                                                  .from('items')
                                                                  .select('id,name, description, price, image_url, is_active, category_id,  simple_id')
                                                                  .eq('id', id)
                                                                  .single();


      if(itemDetailError)
        throw itemDetailError;


      let categoryName = 'uncategorized';
      if(itemDetail.category_id){
      //getCategory name
      
      const{data:catName, error:catNameError} = await this.supabaseClient
                                                          .from('Categories')
                                                          .select('name')
                                                          .eq('id', itemDetail.category_id)
                                                          .single();

      if(!catNameError && catName){
        categoryName = catName.name;
      }
      }

      return {
        ...itemDetail,
        category_name : categoryName
      }

    }catch(error){
      console.error('item-details service:', error);
      throw error;
    }

    
  } 
}


// const itemDetails: IItems = {
//           id: item.id,
//           name: item.name,
//           description: item.description,
//           price: item.price,
//           image_url: item.image_url,
//           is_active: item.is_active,
//           category_id: item.category_id,
//           category_name: 'unCategorized',
//           simple_id: item.simple_id
//         };