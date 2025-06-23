import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth-service/authentication.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { environment, userToken } from '../../core/environment/environment';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);

  signinForm:FormGroup = new FormGroup ({
    email:new FormControl(null, [Validators.required, Validators.email]    ), 
    password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{7,}$/)])
  })

  submitForm(){
    if(this.signinForm.invalid){
      alert("Fix Form Errors!");
      return ;
    }

    this.authService.loginUser(this.signinForm.value)
    .pipe(take(1))
    .subscribe({
      next:(res)=>{
        alert("Successfully Login!")
        // Save token in localStorage
      const accessToken = res.auth.session?.access_token;
      console.log(accessToken);
      console.log(res.auth);
      if (accessToken) {
        localStorage.setItem('tastyForm_access_token', accessToken);
      }
        localStorage.setItem(userToken.token, res.profile.name);
        this.router.navigate(['/home']);
      }, 
      error:(err)=>{
        alert(`Error: ${err.message}`);
      }
    });
  }
}
