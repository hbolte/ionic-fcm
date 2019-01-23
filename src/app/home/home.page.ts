import {Component} from '@angular/core';
import {Firebase} from '@ionic-native/firebase/ngx';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private fcmToken: string;

  constructor(private platform: Platform, private fcm: Firebase) {
    this.platform.ready().then(() => {
      this.init();
    });
  }

  init() {
    this.fcm.subscribe('all');
    this.fcm.getToken().then(token => {
        if (token) {
          this.fcmToken = token;
          console.log('FCM Token: ' + this.fcmToken);
        }
      },
      (err) => {
        console.log('Token Error: ' + err);
      }
    );

    this.fcm.onTokenRefresh().subscribe(
      (token) => {
        if (token) {
          this.fcmToken = token;
          console.log('FCM Token Refresh: ' + this.fcmToken);
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.onNotification();
  }

  /**
   * observe opening fcm's (click)
   *
   */
  onNotification() {
    this.fcm.onNotificationOpen().subscribe(data => {
        if (data) {
          console.log('Opened Notification with Payload: ' + JSON.stringify(data));
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
