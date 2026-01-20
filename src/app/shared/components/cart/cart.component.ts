import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IItems } from '../../interfaces/iitems';
import { CartService } from '../../../core/services/cart-service/cart.service';
import { AuthenticationService } from '../../../core/services/auth-service/authentication.service';
import { ICartItem } from '../../interfaces/icart';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  // cartItems : WritableSignal<IItems> = 

  private readonly authService = inject(AuthenticationService);
  private readonly cartService = inject(CartService);

  userId = computed(() => this.authService.currentClient()?.id || '');

  userName = computed(() => this.authService.currentClient()?.name || '');

  cartItems = signal<ICartItem[]>([]);

  subtotal = 0;

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
        this.cartItems.set(items);
        this.calculateOrderTotal();
      }, 
      error:(err)=>{
        console.log('error in get Cart Items!');
      }
    })
  }

  deleteItemCart(id:string){
    const confirmed = confirm('Are you sure you want to remove this item from your cart?');
    if (!confirmed) return;

    this.cartService.deleteItemCartService(id).subscribe({
      next:(res)=>{
        console.log(res.message);
      }, error:(err)=>{
        console.log(err)
      }
    })

  }

  calculateOrderTotal(){
    this.subtotal= this.cartItems().reduce((total, item) => total + item.quantity * item.price, 0);
  }

}
