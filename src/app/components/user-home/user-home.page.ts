import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  favoritesAdded = 0;
  addRecommendation = false;
  itemsFavorite = [];
  addedFavorites = [];
  isLoading = false;
  predictedResults = [];
  imagesPredicted = [];

  reviewsOfCloth = [];

  review = '';
  stars = 0;
  clothID = 0;

  constructor(private userService: UserService,
              private toastController: ToastController,
              private loader: LoadingController,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    // tslint:disable-next-line:no-string-literal
    this.favoritesAdded = this.getDecodedAccessToken(localStorage.getItem('token'))['favoritesAdded'];
    if (this.favoritesAdded === 0) {
      this.getFavItems();
      this.presentToast('Please select 5 fashions you like', 3000);
    } else {
      this.getItems();
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

  addUserFav() {
    console.log(this.getDecodedAccessToken(localStorage.getItem('token'))['user_id']);
    this.userService.addFavarites(this.getDecodedAccessToken(localStorage.getItem('token'))['user_id'], this.addedFavorites).subscribe(data => {
      this.favoritesAdded = 1;
      this.getItems();
    }, error => {
      console.log(error);
    });
  }

  getItems() {
    this.isLoading = true;
    this.userService.getRecommendedItems(this.getDecodedAccessToken(localStorage.getItem('token'))['user_id']).subscribe(data => {
      console.log(data);

      for (let i in data['data']) {
        let TYPED_ARRAY = new Uint8Array(data['data'][i][0]['cloth_image']['data']);
        // let STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);
        let imageurl:SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'  + base64String);
        this.imagesPredicted.push(imageurl);
        this.predictedResults.push(data['data'][i][0]);
      }
      this.isLoading = false;
    }, error => {
      console.log(error);
    })
  }

  goBackToCloths(){
    this.addRecommendation = false;
  }
  
  addReview(){
    this.userService.addReview(this.getDecodedAccessToken(localStorage.getItem('token'))['user_id'],this.clothID,this.stars,this.review,this.getDecodedAccessToken(localStorage.getItem('token'))['age']).subscribe(data=>{
      this.presentToast('Review Added Successfully',3000);
    },error=>{
      console.log(error);
    });
  }

  addReviewOpen(id){
    this.reviewsOfCloth = [];
    this.stars = 0;
    this.review = '';
    this.clothID = id;
    this.userService.getReviews(id).subscribe(data=>{
      for(let i in data['data']){
        this.reviewsOfCloth.push(data['data'][i]);
      }
      this.addRecommendation = true;
    },error=>{
      this.presentToast('Error Connecting to Server',3000);
    })
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
