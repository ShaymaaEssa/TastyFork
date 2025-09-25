import { Component, computed, inject, OnInit, WritableSignal } from '@angular/core';
import { IItems } from '../../interfaces/iitems';
import { CartService } from '../../../core/services/cart-service/cart.service';
import { AuthenticationService } from '../../../core/services/auth-service/authentication.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  // cartItems : WritableSignal<IItems> = 

  private readonly authService = inject(AuthenticationService);
  private readonly cartService = inject(CartService);

  userId = computed(() => this.authService.currentClient()?.id || '');

  userName = computed(() => this.authService.currentClient()?.name || '');

  ngOnInit(): void {
    this.getCartItems();
    console.log(`Client Id - Cart Component: ${this.userId()}`);
    console.log(`Client Name - Cart Component: ${this.userName()}`);
  }

  getCartItems(){

    const userId = this.userId();
    
    if (!userId) {
      console.log('Please log in to view your cart');
      return;
    }

    this.cartService.getCartItems(this.userId()).subscribe({
      next: (items)=>{
        console.log('Cart Items', items);
      }, 
      error:(err)=>{
        console.log('error in get Cart Items!');
      }
    })
  }

}
