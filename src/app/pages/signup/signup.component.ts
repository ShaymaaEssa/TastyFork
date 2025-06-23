import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../core/services/auth-service/authentication.service';
import { Router, RouterLink } from '@angular/router';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { take } from 'rxjs';



@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  private readonly authService = inject(AuthenticationService);
  private readonly router = inject (Router);

  signupForm :FormGroup = new FormGroup ({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]), 
    email:new FormControl(null, [Validators.required, Validators.email]),
    password:new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{7,}$/)]),
    rePassword: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    address: new FormControl(null, [])
  }, this.confirmPassword) ;

  confirmPassword(group: AbstractControl){
    const password =  group.get('password')?.value;
    const rePassword =  group.get('rePassword')?.value;
    return password === rePassword ? null : {mismatch:true};
  }

  submitForm(){
    if(this.signupForm.invalid){
      alert("Fix Form Problem!");
      return ;
    }


    this.authService.registerUser(this.signupForm.value)
                      .pipe(take(1)) // Take only the first value emitted by the Observable, then automatically unsubscribe.
                      .subscribe({
                        next:(res)=>{
                          alert("Account created successfully!");
                          this.signupForm.reset();
                          setTimeout(()=>{
                            this.router.navigate(['/signin'])
                          }, 2000)
                        }, 
                        error:(err)=>{
                          alert("Problem in creating account!");;
                        }
                      })

  }

}
