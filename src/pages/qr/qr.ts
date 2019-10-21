import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the QrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-qr',
  templateUrl: 'qr.html',
})
export class QrPage {

  elementType = 'text';
  value = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl : ViewController) {
    this.value = navParams.get('llave');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
