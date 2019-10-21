import { Component } from '@angular/core';
import { NavController, ActionSheetController,ToastController,Platform, ModalController, Events } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';

import { QrPage } from '../qr/qr';

import {JSEncrypt} from 'jsencrypt';
import { AyudaPage } from '../ayuda/ayuda';


@Component({
  selector: 'page-generaror-llaves',
  templateUrl: 'generaror-llaves.html'
})
export class GeneradorLlavesPage {

  // JSEncrypt liberia posta
  // puede ser 256 - 512 -1024 -etc
  //  http://travistidwell.com/jsencrypt/demo/
  tamanoLLave = 512;

  llavePrivada : string;
  llavePublica: string;

  constructor(public navCtrl: NavController,public modalCtrl : ModalController,public actionSheetCtrl: ActionSheetController,private toastCtrl: ToastController,private platform: Platform,
    private clipboard: Clipboard,private socialSharing: SocialSharing, private storage : Storage,public events : Events) {

  }

  ionViewDidLoad() {
    //TODO: Lo correcto seria que estubiera en tabs pero tiene un bugs con la inyeccion de dependecia de otros modulos
    this.storage.get('tutorial').then((val) => {
      if(!val){
        let qrModal = this.modalCtrl.create(AyudaPage)
        qrModal.present();

        this.storage.set("tutorial",true);
      }
    });

    // revisa si la primera ves la aplicacion
    this.storage.get('llaves').then((val) => {
        if(val){
        this.llavePrivada = val.llavePrivada as string;
        this.llavePublica = val.llavePublica as string;
      }
    });
    
  }

  generarLlaves(){
    let rsa = new JSEncrypt({default_key_size: this.tamanoLLave});
    this.llavePrivada = rsa.getPrivateKey()
    this.llavePublica = rsa.getPublicKey();
    
    let llaves = {
      "llavePrivada" : this.llavePrivada,
      "llavePublica" : this.llavePublica,
    }

    this.storage.remove("llaves");
    this.storage.set("llaves",llaves);

    this.presentToastText("Se han generado las llaves");
  }

  public llaveSeleccionada(llave : string, titulo : string) {
    let actionSheet = this.actionSheetCtrl.create({
      title: titulo,
      buttons: [
        {
          text: 'Mostar codigo qr',
          icon: 'barcode',
          handler: () => {
            let qrModal = this.modalCtrl.create(QrPage,{llave: llave})
            qrModal.present();
          }
        },
        {
          text: 'Copiar',
          icon: 'copy',
          handler: () => {

            // reviso si la plataforma aplicacion movil o si es un navegador
            if (this.platform.is('cordova')) {
              this.clipboard.copy(llave)
            }else{
              this.alternativeCopyToClipboard(llave);
            }

            this.presentToastText("Se ha copiado la llave");
          }
        },
        {
          text: 'Compartir',
          icon: 'share',
          handler: () => {
              this.socialSharing.share(llave);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
     actionSheet.present();
  }

  presentToastText(mostrar : string) {
    let toast = this.toastCtrl.create({
      message: mostrar,
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }

  alternativeCopyToClipboard(text){
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  copiarLlavesEncriptarDesencriptar(){
    this.events.publish('cargar-llaves', this.llavePublica,this.llavePrivada);
  }


}
