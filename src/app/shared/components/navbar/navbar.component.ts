import { Component, HostListener, OnInit } from '@angular/core';
import { userToken } from '../../../core/environment/environment';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll(){
    this.isScrolled = window.scrollY >10;
  }

  isUserLoged:boolean = false;
    ngOnInit(): void {
      this.isUserLoged = localStorage.getItem(userToken.token)? true : false;
  }



}
