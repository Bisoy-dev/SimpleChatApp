import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationServiceService } from '../application-service.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  public chats: any[] = [];
  constructor(private appService: ApplicationServiceService, private route: Router) { }

  ngOnInit(): void { 
    if(!this.appService.isLoggedIn()){
      this.route.navigate(['/login'])
    } 
    this.appService.getChats().subscribe((data:any[])=>{
      this.chats = data 
      console.log(this.chats)
    })
  }
  public setChatUserName(nickName:string): void{
    this.appService.setUserChatNickName(nickName);
  }
}
