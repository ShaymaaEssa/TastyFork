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

  getItemDetails(itemId: string): void {
    this.itemsService.getItemDetail(itemId).subscribe({
      next: (data) => {
        console.log("items detail", data);
      },
      error: (error) => {
        console.log(`item details errors: ${error.message}`);
      }
    })
  }

}
