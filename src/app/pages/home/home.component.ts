import { Component, computed, inject, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CategoriesService } from '../../core/services/Categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { IItems } from '../../shared/interfaces/iitems';
import { CurrencyPipe } from '@angular/common';
import { ItemsService } from '../../core/services/items-service/items.service';
import { userToken } from '../../core/environment/environment';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart-service/cart.service';
import { AuthenticationService } from '../../core/services/auth-service/authentication.service';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  isUserLogged:boolean = false;

  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);


  heroSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay:true,
    autoplayTimeout:4000,
    autoplayHoverPause:true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }

    categoriesSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay:true,
    autoplayTimeout:4000,
    autoplayHoverPause:true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items:3
      },
      940: {
        items: 5
      }
    },
    nav: false
  }

  dayDealsSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay:true,
    autoplayTimeout:4000,
    autoplayHoverPause:true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items:3
      },
      940: {
        items:4
      }
    },
    nav: false
  }


  categoriesArr : ICategory [] = [];
  bestSellerArr : IItems[] = [];
  bestDealsArr : IItems[] = [];

  private categoryService = inject(CategoriesService);
  private itemsService = inject(ItemsService);
  private authService = inject (AuthenticationService);
  clientID = computed(()=>this.authService.currentClient()?.id);


  ngOnInit(): void {
    this.getCategories();
    this.getBestSeller();
    this.getBestDealsItems();

    if(localStorage.getItem(userToken.token)){
      this.isUserLogged = true;
    }
    
  }

  getCategories(){

    this.categoryService.getActiveCategories().subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.categoriesArr = res;
        },
        error:(err)=>{
          console.log(err.message)
        }
      }
    )
  }

  getBestSeller(){
    this.itemsService.getBestSellers().subscribe({
      next:(res)=>{
        console.log(`BestSeller Arr: ${res}`);
        this.bestSellerArr = res;
      },
      error:(err)=>{
        alert(err.message);
      }
    })
  }

  getBestDealsItems(){
    this.itemsService.getBestDeals().subscribe({
      next:(res)=>{
        console.log(`Best Deals: ${res}`);
        this.bestDealsArr = res;
      }, 
      error:(err)=>{
        alert(err.message);
      }
    })

  }

  addToCart(itemId:string){
    if(this.isUserLogged){
      this.cartService.addItemToCart(this.clientID, itemId, 1).subscribe({
        next:(res)=>{
          console.log(res);
          this.cartService.cartNumber.set(res.numOfCartItems);
          console.log(`Cart Number: ${res.numOfCartItems}`);
        }, 
        error:(err)=>{
          console.log(err);
        }
      })

    }
    else{
      this.router.navigate(['/signin'])
    }
  }

}
