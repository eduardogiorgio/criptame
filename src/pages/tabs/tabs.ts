import { Component, ViewChild } from '@angular/core';
import { NavController, Events, ToastController, ModalController } from 'ionic-angular';

import { AyudaPage } from '../ayuda/ayuda';

import { GeneradorLlavesPage } from '../generaror-llaves/generaror-llaves';
import { EncriptarPage } from '../encriptar/encriptar';
import { DesencriptarPage } from '../desencriptar/desencriptar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SuperTabs } from 'ionic2-super-tabs';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  message = "Descargate criptame, la aplicacion para cifrar";
  link = "https://play.google.com/store/apps/details?id=io.lapacda.cripame";

  tab1Root = GeneradorLlavesPage;
  tab2Root = EncriptarPage;
  tab3Root = DesencriptarPage;

  @ViewChild('tabs') tabsContainer: SuperTabs;

  constructor(public navCtrl: NavController,public modalCtrl : ModalController,public socialSharing: SocialSharing,public events : Events,private toastCtrl: ToastController,
    ) {

    events.subscribe('cargar-llaves', (llavePublica,llavePrivada) => {
        this.events.publish('cargar-llave-publica', llavePublica);
        this.events.publish('cargar-llave-privada', llavePrivada);
        this.presentToastText("Las llaves fueron copiadas");
    });
  }

  ionViewDidLoad() {

    // Precarga todos los tabs
    this.tabsContainer._tabs.forEach((tab, i) => {
      if(i!= 0)
      tab.load(true);
    });
  }

  mostrarAyuda(){
    this.navCtrl.push(AyudaPage);
  }

  compartirAplicacion(){
    this.socialSharing.share(this.message,"","",this.link);
  }

  presentToastText(mostrar : string) {
    let toast = this.toastCtrl.create({
      message: mostrar,
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }

}
