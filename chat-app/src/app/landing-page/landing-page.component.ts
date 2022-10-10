import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationServiceService } from '../application-service.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private appService: ApplicationServiceService, private route: Router) { }

  ngOnInit(): void { 
    if(this.appService.isLoggedIn()){
      this.route.navigate(['/home'])
    }
  }

}
