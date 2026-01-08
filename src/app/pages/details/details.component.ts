import { IItems } from './../../shared/interfaces/iitems';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../core/services/items-service/items.service';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { userToken } from '../../core/environment/environment';
import { CartService } from '../../core/services/cart-service/cart.service';
import { AuthenticationService } from '../../core/services/auth-service/authentication.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {


  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly itemsService = inject(ItemsService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthenticationService);
  private readonly toasterAlert = inject(ToastrService);
  private readonly router = inject(Router);

  clientID = computed(() => this.authService.currentClient()?.id || '');

  item: IItems = {} as IItems;
  quantity: number = 1;
  isUserLogged: boolean = false;

  constructor(private flowbiteService: FlowbiteService) { }

  ngOnInit(): void {

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let itemId = p.get('item_id');
        if (itemId) {
          this.getItemDetails(itemId);
        }

      }
    })

    if (localStorage.getItem(userToken.token)) {
      this.isUserLogged = true;
    }
  }

  async getItemDetails(itemId: string) {
    try {
      this.item = await this.itemsService.getItemDetailSimple(itemId);
      console.log(`item details component: ${this.item.name}`);
    } catch (error) {
      console.log('item details component error: ', error);
    }

  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQuantity() {
    if (this.quantity < 50) {
      this.quantity++;
    }
  }


  addToCart(itemID: string) {
    console.log(`Add to cart clicked for item ID: ${itemID} with quantity: ${this.quantity}`);
    if (this.isUserLogged) {
      this.cartService.addItemToCart(this.clientID(), itemID, this.quantity).subscribe({
        next: (res) => {
          console.log(res);
          this.cartService.cartNumber.set(res.numOfCartItems);
          console.log(`Cart Number: ${res.numOfCartItems}`);
          this.toasterAlert.success("Item added successfully!", 'TasktyFork');
        },
        error: (err) => {
          console.log(err);
        }
      })

    }
    else {
      this.router.navigate(['/signin'])
    }


  }

}
