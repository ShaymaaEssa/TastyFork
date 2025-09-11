import { Component, OnInit, WritableSignal } from '@angular/core';
import { IItems } from '../../interfaces/iitems';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  // cartItems : WritableSignal<IItems> = 

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems(){

  }

}
