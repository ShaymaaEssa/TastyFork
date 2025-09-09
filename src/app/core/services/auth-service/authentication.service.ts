import { IClient } from './../../../shared/interfaces/iclient';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
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
  currentClient :WritableSignal<IClient|null> = signal<IClient|null>(null) ;
  isLoading: WritableSignal<boolean> = signal(false);

  constructor() {
    if (isPlatformBrowser(this.ID)) {
      //supabase client:Gateway to Your Backend Services
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

      this.intializeSession();
    }
   }

   private async intializeSession(){
    try{

      const {data:{session}, error} = await this.supabase.auth.getSession();

      if(error){
        console.log(`Intialize Session Failed with Error: ${error}`)
        return;
      }

      //if there is an existing session
      if(session){
         console.log('Found existing session for user:', session.user.id);
         await this.loadClientProfile(session.user.id);
      } 
      //no existing session
      else {
        console.log('No active session found');
      }

    } catch(error){
      console.log(`Intialize Session Failed with Error: ${error}`)
    } finally {
      this.isLoading.set(false);
    }

   }

   private async loadClientProfile(userId:string):Promise<void>{

    try{

      const {data:profileData, error:profileError} = await this.supabase
                                                    .from('clients')
                                                    .select('*')
                                                    .eq('id', userId)
                                                    .single();

      if(profileError){
        console.log(`Failed in loading existing session: ${profileError}`);
        throw profileError;
      }

      this.currentClient.set(profileData as IClient);



    } catch(error){
      console.log(`Error in loading existing session: ${error}`);
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

          // DEBUG: Check the user ID first
      console.log('User ID from auth:', authResponse.data.user?.id);

      const {data:profileData, error:profileError} = await this.supabase
                                                                .from('clients')
                                                                .select('*')
                                                                .eq('id', authResponse.data.user?.id)
                                                                .single();

      //if query fails throw error
      if(profileError) throw profileError;

      // DEBUG: See the complete response
      console.log('Full profile response:', { data: profileData.name, error: profileError });

      //set current client 
      this.currentClient.set(profileData as IClient);

      return{auth:authResponse.data, profile:profileData};
    }))
  }

  async logout():Promise<void>{
    try{

      const {error:signoutError} = await this.supabase.auth.signOut();

      if(signoutError){
        console.log(`Logout Error: ${signoutError}`);
        throw signoutError;
      }

      this.currentClient.set(null);
      console.log(`Logout Success`);

    } catch (error){
      console.log(`Logout Error: ${error}`);
    }

  }
}
