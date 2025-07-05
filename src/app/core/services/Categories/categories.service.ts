import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environment/environment';
import { from, map, Observable } from 'rxjs';
import { ICategory } from '../../../shared/interfaces/icategory';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private supabaseClient !:SupabaseClient;
  private readonly id = inject(PLATFORM_ID); 

  constructor() {
    if(isPlatformBrowser(this.id)){
      this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
   }

   getActiveCategories():Observable<ICategory[]>{

    return from (this.supabaseClient
                      .from ('categories')
                      .select('name, description, image_url')
                      .eq('is_active', true)
    ).pipe(map(res => res.data as ICategory[] || []))
   }
}
