import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    // tslint:disable-next-line:object-literal-key-quotes
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
  private jwtHelper = new JwtHelperService();
  private BACKEND_URL = 'http://35.226.251.116:8080/';

  constructor(private http: HttpClient) { }

  public login(email, password) {
    // tslint:disable-next-line:object-literal-key-quotes
    return this.http.post(this.BACKEND_URL + 'user/login', { 'email': email, 'password': password }).pipe(map(res => res));
  }

  public register(firstname, lastname, age, address, email, password) {
    return this.http.post(this.BACKEND_URL + 'user/register',
      // tslint:disable
      { 'firstname': firstname, 'lastname': lastname,'age':age, 'address': address, 'email': email, 'password': password }).pipe(map(res => res));
  }

  public isAuthenticated(): boolean {
    if (localStorage.getItem('token') !== null) {
      const token = localStorage.getItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    } else {
      return false;
    }
  }

  public forgetPassword(email) {
    // tslint:disable-next-line:object-literal-key-quotes
    return this.http.post(this.BACKEND_URL + 'user/forgetpassword', { 'email': email }).pipe(map(res => res));
  }

  public checkToken(email, token) {
    // tslint:disable-next-line:object-literal-key-quotes
    return this.http.post(this.BACKEND_URL + 'user/forgetpassword/token', { 'email': email, 'token': token }).pipe(map(res => res));
  }
  public changePassword(email, password) {
    return this.http.post(this.BACKEND_URL + 'user/forgetpassword/changepassword',
      // tslint:disable-next-line:object-literal-key-quotes
      { 'email': email, 'password': password }).pipe(map(res => res));
  }

  public getItems() {
    return this.http.get(this.BACKEND_URL + 'item/', { headers: this.headers }).pipe(map(res => res));
  }

  public addFavarites(id, fav) {
     // tslint:disable
    return this.http.post(this.BACKEND_URL + 'item/favorite', { 'id': id, 'fav': fav }, { headers: this.headers }).pipe(map(res => res));
  }

  public getRecommendedItems(id){
    return this.http.post(this.BACKEND_URL + 'item/recommend',{'id':id},{headers:this.headers}).pipe(map(res=>res));
  }
  public getReviews(id){
    return this.http.post(this.BACKEND_URL + 'item/reviews',{'id':id},{headers:this.headers}).pipe(map(res=>res));
  }
  public addReview(userid,clothid,stars,review,age){
    return this.http.post(this.BACKEND_URL + 'item/addReview',{'userID':userid,'clothID':clothid,'stars':stars,'review':review,'age':age},{headers:this.headers}).pipe(map(res=>res));
  }
}
