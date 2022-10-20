import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../providers/services/validation-service';

/**
 * Generated class for the ControlMessagesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
// @Component({
//   selector: 'control-messages',
//   template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
// })
// export class ControlMessagesComponent {
//   @Input("control") control: FormControl;
//   constructor() {}
//   get errorMessage() {
//     for (let propertyName in this.control.errors) {
//       if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
//         return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
//       }
//     }

//     return null;
//   }
// }
