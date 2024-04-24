import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {ProductService} from "./services/product.service";
import {RouterModule} from "@angular/router";
import {routes} from "./app.routes";
import {AppComponent} from "./app.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [
    ProductService
  ]
})
export class AppModule { }
