import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { ApplicationServiceService } from '../application-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private _hubConnection : any;

  messages: any[] = [];
  message:any = {}; 
  clientMessage:any = {};
  chatId: any; 
  userChatNickName: string = ''; 
  myNickName: string = '';  
  userId: any;

  public formGroup : FormGroup;
  constructor(private appService: ApplicationServiceService, private route: Router, private params: ActivatedRoute, private formBuilder: FormBuilder) { 
    this.formGroup = formBuilder.group({
      chatID : '',
      text: new FormControl('',[Validators.required])
    }); 
    this.formGroup.valueChanges.subscribe();
   }

  ngOnInit(): void { 
    if(!this.appService.isLoggedIn()){
      this.route.navigate(['/login'])
    } 
    this.chatId = this.params.snapshot.paramMap.get('chatId') 

    this.createConnection(); 

    this.appService.getUserInfo().subscribe((data:any)=>{
      this.myNickName = data.nickName;
      this.userId = data.userId;
    }) 
    this.userChatNickName = this.appService.getUserChatNickName();
    this.appService.getConversation(this.chatId).subscribe((data:any)=>{
      this.messages = data; 
      console.log(this.userChatNickName)
      console.log(this.messages)
    }) 

    this._hubConnection.on("RecieveMessage", (data:any)=>{
      if(this.chatId == data.chatId){
        this.messages.push(data)
        console.log(data)
      }
    })
    
  } 
  public createConnection(): void{
    this._hubConnection = new HubConnectionBuilder().withUrl('https://localhost:5001/chathub')
    .build(); 

    this._hubConnection.start()
    .then(()=>{
      console.log('Connected successfully');
    }).catch((err:any) =>{
      console.log('Connection failed with error '+err)
    })
  }
  public sendMessage(){ 
    if(this.formGroup.valid){
      this.formGroup.patchValue({chatID: this.chatId});
      alert(this.formGroup.controls['text'].value +"-"+this.formGroup.controls['chatID'].value) 
      const cId = this.formGroup.controls['chatID'].value;
      const txt = this.formGroup.controls['text'].value; 
      this.message = {
        chatId: cId,
        text: txt
      } 
      this.clientMessage = {
        chatId: cId,
        userId: this.userId,
        userNickName: this.myNickName,
        text: txt,
        sendDate: new Date().toISOString()
      } 
      this.appService.sendMessage(this.formGroup.value)
      .subscribe((res:any)=>{
        console.log(res)
      })
      this.formGroup.patchValue({text: ""})
    }else{
      alert('Please put some a message!')
    }
  }
}
