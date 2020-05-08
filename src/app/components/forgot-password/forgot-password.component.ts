import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  token = '';
  emailSuccess = false;
  tokenSuccess = false;
  password = '';
  retypePassword = '';
  constructor(private router: Router,
              private route: ActivatedRoute,
              public toastController: ToastController,
              public loadingController: LoadingController,
              private userService: UserService) { }

  ngOnInit() { }

  login() {
    this.emailSuccess = false;
    this.tokenSuccess = false;
    this.router.navigate(['./signin']);
  }
  sendEmail() {
    this.userService.forgetPassword(this.email).subscribe(data => {
      this.presentToast('Successfully send the mail', 2000);
      this.emailSuccess = true;
    }, error => {
      // tslint:disable-next-line:no-string-literal
      if (error['status'] === 404) {
        this.presentToast('Error Connecting to Server', 2000);
        // tslint:disable-next-line:no-string-literal
      } else if (error['status'] === 401) {
        this.presentToast('Invalid Email address!', 2000);
      }
    });
  }
  checkToken() {
    this.userService.checkToken(this.email, this.token).subscribe(success => {
      this.tokenSuccess = true;
      this.presentToast('Valid token identified !', 2000);
    }, error => {
      // tslint:disable-next-line:no-string-literal
      if (error['status'] === 404) {
        this.presentToast('Error Connecting to Server', 2000);
        // tslint:disable-next-line:no-string-literal
      } else if (error['status'] === 401) {
        this.presentToast('Invalid token identified !', 2000);
      }
      this.presentToast('Invalid token identified !!', 2000);
    });
  }
  changePassword() {
    if (this.password.trim() === this.retypePassword.trim()) {
      this.userService.changePassword(this.email, this.password).subscribe(success => {
        this.presentToast('Password Successfully Changed !', 2000);
        this.router.navigate(['./signin']);
      }, error => {
        // tslint:disable-next-line:no-string-literal
        if (error['status'] === 401) {
          this.presentToast('Error Connecting to Server !', 2000);
        }
        this.presentToast('Error Connecting to Server !!', 2000);
      });
    } else {
      this.presentToast('Password and retype password doesnt match', 2000);
    }
  }
  async presentToast(msg, dur) {
    const toast = await this.toastController.create({
      message: msg,
      duration: dur,
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
}
