import {Component, OnInit} from '@angular/core';
import {ProductCategory} from "../../common/product-category";
import {ProductService} from "../../services/product.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf
  ],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit {

  protected productCategories!: ProductCategory[];

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.listProductCategories();
  }

  private listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log("Product Categories=" + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }


}
