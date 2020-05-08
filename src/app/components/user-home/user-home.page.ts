import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  favoritesAdded = 0;
  itemsFavorite = [];
  addedFavorites = [];
  constructor(private userService: UserService, private toastController: ToastController) { }

  ngOnInit() {
    // tslint:disable-next-line:no-string-literal
    this.favoritesAdded = this.getDecodedAccessToken(localStorage.getItem('token'))['favoritesAdded'];
    this.getFavItems();
    if (this.favoritesAdded === 0) {
      this.presentToast('Please select 5 fashions you like', 3000);
    }
  }

  getFavItems() {
    this.userService.getItems().subscribe(data => {
      // tslint:disable-next-line:no-string-literal
      if (data['data'].length > 0) {
        // tslint:disable
        for (let i in data['data']) {
          // tslint:disable
          this.itemsFavorite.push(data['data'][i]);
        }
      }
    }, error => {

    });
  }

  //add & remove favorites
  favAdded(id) {
    this.addedFavorites.push(id);
  }
  favRemoved(id) {
    this.addedFavorites.forEach((item, index) => {
      if (item == id) this.addedFavorites.splice(index, 1);
    });
  }
  addUserFav(){
    console.log(this.getDecodedAccessToken(localStorage.getItem('token'))['user_id']);
    this.userService.addFavarites(this.getDecodedAccessToken(localStorage.getItem('token'))['user_id'],this.addedFavorites).subscribe(data=>{
      this.favoritesAdded = 1;
    },error=>{
      console.log(error);
    });
  }
  async presentToast(msg, dur) {
    const toast = await this.toastController.create({
      message: msg,
      duration: dur,
      cssClass: 'toast-message',
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
    return toast.onDidDismiss();
  }
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
