import { Component, OnInit } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { ApplicationServiceService } from '../application-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isLogIn: boolean = false;
  public myNickName: string = '';
  private userId : string = '';
  public messageNotifNumber : number = 0;
  private _hubConnection: any;
  constructor(private appService: ApplicationServiceService) { }

  ngOnInit(): void { 
    this.isLogIn = this.appService.isLoggedIn(); 
    if(this.appService.isLoggedIn()){ 
      this.createConnection();
      this.appService.getUserInfo().subscribe((data:any)=>{
        this.userId = data.userId;
        this.myNickName = data.nickName;
        console.log('My id: '+this.userId)
      })  

      this.appService.getMessageNotifNumber().subscribe((data:any)=>{
        this.messageNotifNumber = data.numberOfMessage;
        console.log(data)
      })

      this._hubConnection.on('RecieveMessageNotificationNumber', (data:any)=>{
        if(this.userId == data.userId){
          this.messageNotifNumber = data.numberOfMessage;
          console.log(data)
        }
      })
    }
  } 
  public clearMessageNotifNumber(){
    this.messageNotifNumber = 0;
  }
  private createConnection():void{
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build(); 

    this._hubConnection.start()
    .then(()=>{
      console.log('Connected sucessfully.')
    }).catch((err:any) =>{
      console.log('Connection failed with error '+err)
    })
  }
  public logOut(){
    window.location.reload()
    this.appService.logOut();
  }
}
