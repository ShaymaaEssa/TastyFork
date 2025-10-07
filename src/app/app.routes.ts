import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { pages } from './core/environment/pages';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { loggedUserGuard } from './core/guards/logged-user/logged-user.guard';
import { CartComponent } from './shared/components/cart/cart.component';
import { DetailsComponent } from './pages/details/details.component';

export const routes: Routes = [

    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'', component:AuthLayoutComponent,canActivate: [loggedUserGuard],  children:[
        {path:pages.Signin, component:SigninComponent, title:'Sign-in'}, 
        {path:pages.Signup, component:SignupComponent, title:'sign-up'}
    ]},
    {path:'', component:BlankLayoutComponent, children:[
        {path:pages.Home, component:HomeComponent, title:'Home'}, 
        {path:pages.Cart, component:CartComponent, title:'Cart'}, 
        {path:`${pages.Details}/:id`, component:DetailsComponent, title:'item-details'}
    ]}
];
