import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationServiceService {
  private userChatNickName: string = '';

  private BASE_URL : string = "https://localhost:5001/";
  constructor(private httpClient: HttpClient) { }  
  //set user chat username
  public setUserChatNickName(nickName: string): void{
    this.userChatNickName = nickName;
  } 
  public getUserChatNickName():string{
    return this.userChatNickName;
  }
  //end of setting getting chat username

  public logIn(user:any): Observable<any>{
    return this.httpClient.post(this.BASE_URL+"api/user/login",user);
  } 
  public logOut(){
    localStorage.removeItem("user-logged");
  }

  public setStorage(token:string){
    localStorage.setItem("user-logged",token )
  } 
  public isLoggedIn(): boolean{
    return !!localStorage.getItem("user-logged");
  }  
  public getToken(): any{
    return localStorage.getItem('user-logged');
  }
  public getUserRole(): string{
    var userInfo = JSON.parse(atob(this.getToken().split('.')[1]));
    return userInfo.role;
  } 
  public getChats(): Observable<any[]>{
    
    const header = {
      headers: new HttpHeaders()
      .set('Authorization', 'Bearer '+this.getToken())
    } 

    return this.httpClient.get<any[]>(this.BASE_URL + "api/chat/get-chats", header);
  } 
  public getConversation(chatId:number): Observable<any[]>{
    const header = {
      headers: new HttpHeaders()
      .set('Authorization', 'Bearer '+this.getToken())
    } 
    return this.httpClient.get<any[]>(this.BASE_URL+"api/chat/get-conversation/"
    +chatId, header);
  } 
  public getUserInfo(): Observable<any>{
    const header = {
      headers: new HttpHeaders()
      .set('Authorization', 'Bearer '+this.getToken())
    } 
    return this.httpClient.get<any>(this.BASE_URL+"api/user/dashboard", header);
  } 
  public sendMessage(message: any): Observable<any>{
    const header = {
      headers: new HttpHeaders()
      .set('Authorization','Bearer '+this.getToken())
    } 
    return this.httpClient.post(this.BASE_URL+"api/chat/send-message",message, header);
  } 
  public getMessageNotifNumber(): Observable<any>{
    const header = {
      headers: new HttpHeaders()
      .set('Authorization','Bearer '+this.getToken())
    }  
    return this.httpClient.get<any>(this.BASE_URL+"api/chat/get-mesnotif-number",header)
  } 

}
