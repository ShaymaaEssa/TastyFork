import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'tastyfork';
  private readonly id = inject(PLATFORM_ID);

   ngOnInit(): void {
    if(isPlatformBrowser(this.id)){
      initFlowbite();
    }

  }

}
