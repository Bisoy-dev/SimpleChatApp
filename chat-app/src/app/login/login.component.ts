import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { ApplicationServiceService } from '../application-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup; 

  public message: string = ''; 
  public isValid: boolean = true;
  public isSuccessfully: boolean = false;
  constructor(private formBuilder: FormBuilder, private appService: ApplicationServiceService,private route: Router) { 
    this.formGroup = formBuilder.group(
      {
        userName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      }); 
      this.formGroup.valueChanges.subscribe(); 
   }

  ngOnInit(): void { 
    if(this.appService.isLoggedIn()){
      this.route.navigate(['/home'])
    }
  }
  public logIn(){ 
    if(this.formGroup.valid){
      this.isValid = true;
      this.appService.logIn(this.formGroup.value).subscribe((res:any)=>{ 
        window.location.reload();
        if(res.message === "Login Successfully"){
          this.isValid = true;
          this.isSuccessfully = true; 
          this.message = res.message;
          this.appService.setStorage(res.token) 
          this.route.navigate(['/home'])
        }
      }, (err:any)=>{
        this.isValid = false;
        this.message = "Username or password was invalid!"
      })
    }else{
      this.isValid = false; 
      this.message = "Username and password is required!"
    }
  }
}
