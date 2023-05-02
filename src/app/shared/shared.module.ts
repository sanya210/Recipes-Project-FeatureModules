import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';



@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    DropdownDirective,
    AlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSpinnerComponent,
    DropdownDirective,
    AlertComponent,    
    CommonModule
  ]
})
export class SharedModule { }
