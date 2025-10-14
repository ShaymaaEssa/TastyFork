import { IItems } from './../../shared/interfaces/iitems';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../core/services/items-service/items.service';


@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {


  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly itemsService = inject(ItemsService);

  item:IItems = {} as IItems;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let itemId = p.get('item_id');
        if (itemId) {
          this.getItemDetails(itemId);
        }

      }
    })
  }

  async getItemDetails(itemId: string) {
    try{
      this.item = await this.itemsService.getItemDetailSimple(itemId);
      console.log(`item details component: ${this.item.name}`);
    } catch (error){
      console.log('item details component error: ', error);
    }
    
  }

}
