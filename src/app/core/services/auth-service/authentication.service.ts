import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environment/environment';
import { IClient } from '../../../shared/interfaces/iclient';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private supabase!: SupabaseClient;
  private readonly ID = inject(PLATFORM_ID);
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.ID)) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
   }

   registerUser(userData:IClient):Observable<any>{
    return from (this.supabase.auth.signUp({
      email: userData.email, 
      password: userData.password
    }).then(async (authResponse)=>{
      if(authResponse.error) throw authResponse.error;

      // Add debug logs
        console.log('Auth user ID:', authResponse.data.user?.id);
        console.log('Profile data:', {
          id: authResponse.data.user?.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address
        });


      //insert into profiles table
      const{data, error}= await this.supabase
                                .from ('clients')
                                .insert([{
                                  id: authResponse.data.user?.id,
                                  name: userData.name,
                                  email: userData.email,
                                  phone: userData.phone,
                                  address: userData.address
                                }]);

      if(error) {
         console.error('Database error details:', error);
         throw error;
      }
      return data;
    }))
  }
}
