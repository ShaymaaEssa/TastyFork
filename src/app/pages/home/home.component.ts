import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CategoriesService } from '../../core/services/Categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';

@Component({
  selector: 'app-home',
  imports: [CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{


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

  categoriesArr : ICategory [] = [];

  private categoryService = inject(CategoriesService);
  ngOnInit(): void {
    this.getCategories();
    
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

}
