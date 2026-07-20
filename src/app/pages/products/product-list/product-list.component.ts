import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  loading = true;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar productos';
        this.loading = false;
      }
    });
  }
}
