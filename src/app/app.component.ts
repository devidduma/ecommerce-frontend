import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ProductListComponent} from "./components/product-list/product-list.component";
import {NgOptimizedImage} from "@angular/common";
import {ProductCategoryMenuComponent} from "./components/product-category-menu/product-category-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductListComponent, NgOptimizedImage, RouterLink, RouterLinkActive, ProductCategoryMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce-frontend';
}
