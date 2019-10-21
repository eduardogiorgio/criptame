import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { GeneradorLlavesPage } from '../pages/generaror-llaves/generaror-llaves';
import { EncriptarPage } from '../pages/encriptar/encriptar';
import { DesencriptarPage } from '../pages/desencriptar/desencriptar';
import { QrPage } from '../pages/qr/qr';
import { AyudaPage } from '../pages/ayuda/ayuda';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    MyApp,
    GeneradorLlavesPage,
    EncriptarPage,
    DesencriptarPage,
    QrPage,
    AyudaPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(), // supertabs
    NgxQRCodeModule, // generador codigo qr
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GeneradorLlavesPage,
    EncriptarPage,
    DesencriptarPage,
    QrPage,
    AyudaPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Clipboard, // copiar y pegar texto en los celulares
    BarcodeScanner, // escaneador codigo qr
    SocialSharing
  ]
})
export class AppModule {}
