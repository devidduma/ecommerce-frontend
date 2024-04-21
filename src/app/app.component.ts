import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ProductListComponent} from "./components/product-list/product-list.component";
import {NgOptimizedImage} from "@angular/common";
import {ProductCategoryMenuComponent} from "./components/product-category-menu/product-category-menu.component";
import {SearchComponent} from "./components/search/search.component";
import {CartStatusComponent} from "./components/cart-status/cart-status.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductListComponent, NgOptimizedImage, RouterLink, RouterLinkActive, ProductCategoryMenuComponent, SearchComponent, CartStatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce-frontend';
}
