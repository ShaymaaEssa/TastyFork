import { Component, OnInit } from '@angular/core';
import { userToken } from '../../../core/environment/environment';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  isUserLoged:boolean = false;
    ngOnInit(): void {
      this.isUserLoged = localStorage.getItem(userToken.token)? true : false;
  }

}
