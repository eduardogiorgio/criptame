import { Component } from '@angular/core';
import { NavController, Platform, ToastController, Events } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import {JSEncrypt} from 'jsencrypt';
import { Clipboard } from '@ionic-native/clipboard';

@Component({
  selector: 'page-desencriptar',
  templateUrl: 'desencriptar.html'
})

export class DesencriptarPage {

  
  llaveDesencriptar: string;
  textoDesencriptar: string;
  textoDesencriptado: string;
  
  //TODO: poner en enviroments
  tamanoLLave = 512;
  // maxlength="20" porque lla llave es 256 sino aumentar el tamaño de la llave si quiero un texto mas largo

  constructor(public navCtrl: NavController,private barcodeScanner: BarcodeScanner,public events : Events,
    private toastCtrl: ToastController,private clipboard: Clipboard, private platform : Platform) {
    this.llaveDesencriptar = "";
    this.textoDesencriptar = "";
    this.textoDesencriptado= "";
    
    // Pone en eschucha del evento cargar llave
    events.subscribe('cargar-llave-privada', llave => {
        this.llaveDesencriptar = llave as string;
    });

  }

  escanearCodigoQR(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if(!barcodeData.cancelled){
        this.llaveDesencriptar = barcodeData.text
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }

  desencriptar(){
    if(this.llaveDesencriptar == "" || this.textoDesencriptar == ""){
      this.textoDesencriptado = "";
      return;
    }
    
    let rsa2 = new JSEncrypt({default_key_size: this.tamanoLLave});
    rsa2.setPublicKey(this.llaveDesencriptar);
    let textoDesencriptado = rsa2.decrypt(this.textoDesencriptar);
    // si no dio false la clave es verificada
    if (textoDesencriptado)
      this.textoDesencriptado = textoDesencriptado;
    else
      this.textoDesencriptado = 'No pudo ser desencriptado';
    
  }
  pegarTexto(){
    // solo disponible celulares
    if (!this.platform.is('cordova'))
      return;
    this.clipboard.paste().then(value => this.textoDesencriptar = value );
  }
  
  pegarLLave(){
    // solo disponible celulares
    if (!this.platform.is('cordova'))
      return;
    this.clipboard.paste().then(value => this.llaveDesencriptar = value );
  }

  copiarTexto(){
    if (!this.platform.is('cordova'))
    return;
    this.clipboard.copy(this.textoDesencriptado);
    this.presentToastText("el texto fue copiado");
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