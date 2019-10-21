import { Component } from '@angular/core';
import { NavController, Platform, ToastController, Events } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import {JSEncrypt} from 'jsencrypt';
import { Clipboard } from '@ionic-native/clipboard';

@Component({
  selector: 'page-encriptar',
  templateUrl: 'encriptar.html'
})
export class EncriptarPage {

  
  llaveEncriptar: string;
  textoEncriptar: string;
  textoEncriptado: string;

  //TODO: poner en enviroments
  tamanoLLave = 512;
  // maxlength="20" porque lla llave es 256 sino aumentar el tamaño de la llave si quiero un texto mas largo

  constructor(public navCtrl: NavController,private barcodeScanner: BarcodeScanner,public events : Events,
    private toastCtrl: ToastController,private clipboard: Clipboard, private platform : Platform) {
    this.llaveEncriptar = "";
    this.textoEncriptar = "";
    this.textoEncriptado= "";

    // Pone en eschucha del evento cargar llave
    events.subscribe('cargar-llave-publica', llave => {
      this.llaveEncriptar = llave as string;
   });
  }

  


  escanearCodigoQR(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if(!barcodeData.cancelled){
        this.llaveEncriptar = barcodeData.text
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }
  
  encriptar(){
    if(this.llaveEncriptar == "" || this.textoEncriptar == ""){
      this.textoEncriptado = "";
      return;
    }

    var rsa = new JSEncrypt({default_key_size: this.tamanoLLave});
    rsa.setPrivateKey(this.llaveEncriptar);
    let textoEncriptado = rsa.encrypt(this.textoEncriptar);
    if (textoEncriptado)
    this.textoEncriptado = textoEncriptado;
  else
    this.textoEncriptado = "El texto a encriptar a encriptar supera el tamaño maximo permitido";
  }

  
  pegarTexto(){
    // solo disponible celulares
    if (!this.platform.is('mobileweb'))
      return;
    this.clipboard.paste().then(value => this.textoEncriptar = value );
    
  }
  
  pegarLLave(){
    if (!this.platform.is('mobileweb'))
      return;
    this.clipboard.paste().then(value => this.llaveEncriptar = value );
  }

  copiarTexto(){
    if (!this.platform.is('mobileweb')) {
      this.clipboard.copy(this.textoEncriptado);
    }else{
      this.alternativeCopyToClipboard(this.textoEncriptado);
    }
    
   
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

  alternativeCopyToClipboard(text){
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

}
