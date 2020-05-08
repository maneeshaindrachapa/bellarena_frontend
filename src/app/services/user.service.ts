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

  constructor(private http: HttpClient) { }

  public login(email, password) {
    // tslint:disable-next-line:object-literal-key-quotes
    return this.http.post('http://localhost:8080/user/login', { 'email': email, 'password': password }).pipe(map(res => res));
  }

  public register(firstname, lastname, age, address, email, password) {
    return this.http.post('http://localhost:8080/user/register',
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
    return this.http.post('http://localhost:8080/user/forgetpassword', { 'email': email }).pipe(map(res => res));
  }

  public checkToken(email, token) {
    // tslint:disable-next-line:object-literal-key-quotes
    return this.http.post('http://localhost:8080/user/forgetpassword/token', { 'email': email, 'token': token }).pipe(map(res => res));
  }
  public changePassword(email, password) {
    return this.http.post('http://localhost:8080/user/forgetpassword/changepassword',
      // tslint:disable-next-line:object-literal-key-quotes
      { 'email': email, 'password': password }).pipe(map(res => res));
  }

  public getItems() {
    return this.http.get('http://localhost:8080/item/', { headers: this.headers }).pipe(map(res => res));
  }

  public addFavarites(id, fav) {
     // tslint:disable
    return this.http.post('http://localhost:8080/item/favorite', { 'id': id, 'fav': fav }, { headers: this.headers }).pipe(map(res => res));
  }
}
