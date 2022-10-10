import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationServiceService } from '../application-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private appService: ApplicationServiceService, private route: Router) { }

  ngOnInit(): void { 
    if(!this.appService.isLoggedIn()){
      this.route.navigate(['/login'])
    }
  }

}
