import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { 
  // MatIconModule,
  MatToolbarModule
 } from "@angular/material";
import { MatSidenavModule } from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PlaygroundComponent } from './components/playground/playground.component';

//Services
import { TaggerService } from './providers/tagger.service';
import { AwsClientsService } from "./providers/aws-clients.service";
import { TagLambdaService } from "./providers/tag-lambda.service";
import { TagS3Service } from "./providers/tag-s3.service";
import { TagEc2Service } from "./providers/tag-ec2.service";
import { TagDynamodbService } from "./providers/tag-dynamodb.service";
import { TagApiGatewayService } from "./providers/tag-api-gateway.service";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    PlaygroundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSidenavModule,
    // MatIconModule,
    MatToolbarModule,    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService, TaggerService, AwsClientsService, TagLambdaService, TagS3Service, TagEc2Service, TagDynamodbService, TagApiGatewayService],
  bootstrap: [AppComponent]
})
export class AppModule { }
