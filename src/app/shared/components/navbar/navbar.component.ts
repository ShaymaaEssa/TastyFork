import { Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { userToken } from '../../../core/environment/environment';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../core/services/auth-service/authentication.service';
import { CartService } from '../../../core/services/cart-service/cart.service';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  isScrolled = false;
  isUserLoged = computed(() => this.authService.currentClient() !== null);;
  userName = computed(() => this.authService.currentClient()?.name || '');
  cartNumber :number = 0

  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);
  
  private readonly cartService = inject(CartService);


  @HostListener('window:scroll', [])
  onWindowScroll(){
    this.isScrolled = window.scrollY >10;
  }

  
  //   ngOnInit(): void {
  //     // this.isUserLoged = localStorage.getItem(userToken.token)? true : false;
  //     // if(this.isUserLoged){
  //     //   this.userName = localStorage.getItem(userToken.token);
  //     //   console.log("userName", this.userName);
  //     // }


  //     // console.log("current client",this.authService.currentClient()?.name);
  //     // if (this.authService.currentClient() != null){
  //     //   this.isUserLoged = true;
         
  //     //   this.userName = this.authService.currentClient()?.name;
  //     //   console.log("userName", this.userName);
  //     // }
  // }

    constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }



  async signout(){
    localStorage.removeItem(userToken.token);
    localStorage.removeItem(userToken.access_token);
    await this.authService.logout();
    console.log("signout");
    this.router.navigate(['/home']).then(()=>{
      window.location.reload()
    }); // goes back to home
  }



}
