import { Component, HostListener, inject, OnInit } from '@angular/core';
import { userToken } from '../../../core/environment/environment';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  isScrolled = false;
  isUserLoged:boolean = false;
  userName :string|null = "";
  private readonly router = inject(Router);
  
  @HostListener('window:scroll', [])
  onWindowScroll(){
    this.isScrolled = window.scrollY >10;
  }

  
    ngOnInit(): void {
      this.isUserLoged = localStorage.getItem(userToken.token)? true : false;
      if(this.isUserLoged){
        this.userName = localStorage.getItem(userToken.token);
        console.log("userName", this.userName);
      }
  }

  signout(){
    localStorage.removeItem(userToken.token);
    localStorage.removeItem(userToken.access_token);
    console.log("signout");
    this.router.navigate(['/home']).then(()=>{
      window.location.reload()
    }); // goes back to home
  }



}
