import { IClient } from './../../../shared/interfaces/iclient';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private supabase!: SupabaseClient;
  private readonly ID = inject(PLATFORM_ID);
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.ID)) {
      //supabase client:Gateway to Your Backend Services
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


      //insert into clients table
      const{data, error}= await this.supabase
                                .from ('clients')
                                .insert([{
                                  id: authResponse.data.user?.id,
                                  name: userData.name,
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

  loginUser(userData:IClient):Observable<any>{
    return from(this.supabase.auth.signInWithPassword({
      email:userData.email, 
      password : userData.password
    }).then(
      //If email & password are valid, Supabase returns a user and session in authResponse.data
      //authResponse has two main parts:
      //authResponse.data → contains user, access_token, etc.
      //authResponse.error → contains login error (e.g. "invalid email/password").

      async (authResponse)=>{
      if(authResponse.error)  throw authResponse.error;

      const {data:profileData, error:profileError} = await this.supabase
                                                                .from('clients')
                                                                .select('name')
                                                                .eq('id', authResponse.data.user?.id)
                                                                .single();

      //if query fails throw error
      if(profileError) throw profileError;

      return{auth:authResponse.data, profile:profileData};
    }))
  }
}
