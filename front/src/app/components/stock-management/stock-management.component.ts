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

  removeOneProduct(product: Produit) {
    if(product.quantity < 1){
      //décommenter la ligne 43 si le produit doit être supprimé une fois la quantité à 0
      //this.products = this.products.filter(produit => produit.id = product.id);
      //this.apiService.removeProduct(product);
      alert("La quantité ne peux être négative")
    }
    else{
      product.quantity=product.quantity-1;
      this.apiService.modifyProduct(product);
    }

  }

  openPopin() {
    const dialogRef = this.dialog.open(PopinProductComponent);

    dialogRef.afterClosed().subscribe(result => {
      //Empêche le post d'éléments d'autre types que ceux voulu
      typeof result.name === "string" && typeof result.price === "number" && typeof result.quantity === "number" ?
        result.price >0 && result.quantity > 0 && Number.isInteger(result.quantity) ?  this.products.push(result)
          : alert('Erreur ! Le prix et la quantité doivent être positifs. La quantité doit également être un entier')
         : alert('Erreur ! Le nom doit être une chaine de caractère tandis que les prix et quantité doivent être des nombres')
    });

  }

  addProduct(product: Produit) {
    const productExist = this.products.find(produit => produit.id == product.id)
    if (productExist){
      productExist.quantity += 1;
      this.apiService.modifyProduct(product);
    }
  }
}
