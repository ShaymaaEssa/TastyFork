import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth-service/authentication.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs';
import { environment, userToken } from '../../core/environment/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly toasterAlert = inject(ToastrService);

  isLoading: boolean = false;

  signinForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signinForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{7,}$/
        ),
      ]),
    });
  }
  submitForm() {
    if (this.signinForm.invalid) {
      alert('Fix Form Errors!');
      return;
    }

    this.isLoading = true;

    this.authService
      .loginUser(this.signinForm.value)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          // alert('Successfully Login!');
          this.toasterAlert.success('Successfully Login!', 'TastyFork');

          // Save token in localStorage
          const accessToken = res.auth.session?.access_token;
          console.log(accessToken);
          console.log(res.auth);
          if (accessToken) {
            localStorage.setItem(userToken.access_token, accessToken);
          }
          localStorage.setItem(userToken.token, res.profile.name);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isLoading = false;
          // alert(`Error: ${err.message}`);
          this.toasterAlert.error(`Error: ${err.message}`, 'TastyFork');
        },
      });
  }
}
