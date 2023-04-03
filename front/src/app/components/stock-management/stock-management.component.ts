import {Component, OnInit} from '@angular/core';
import {Produit} from "../../models/produit/produit.model";
import {ApiService} from "../../services/api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {PopinProductComponent} from "../popin-product/popin-product.component";


@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit{

  products : Array<Produit> = [];
  isLoading: boolean = true;
  addElement: string = 'ajouter un produit';
  minusElement: string = 'retirer un produit';

  constructor(private apiService : ApiService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
      this.apiService.getallProduct().subscribe(data => {
        this.products = data;
        this.isLoading = false;
      },
        error => {
              this.openSnackBar('erreur HTTP.','ok');
        })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 8000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
  }

  // G1-4 et G1-14
  // Afin d'éviter qu'un produit ne s'enlève ou que sa quantité soit négatives, le programme a été modifié.
  removeOneProduct(product: Produit) {
    //product.quantity=product.quantity-1;
    if(product.quantity == 0){
      this.products = this.products.filter(produit => produit.id = product.id);
      this.apiService.removeProduct(product);
    }
    if(product.quantity > 0){
      product.quantity=product.quantity-1;
      this.apiService.modifyProduct(product);
    }
    else{
      this.apiService.modifyProduct(product);
    }

  }

  openPopin() {
    const dialogRef = this.dialog.open(PopinProductComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.products.push(result);
    });

  }

  addProduct(product: Produit) {
    if (this.products.find(produit => produit.id == product.id)){
      // @ts-ignore
      this.products.find(produit => produit.id == product.id).quantity += 1;
      this.apiService.modifyProduct(product);
    }
  }
}
