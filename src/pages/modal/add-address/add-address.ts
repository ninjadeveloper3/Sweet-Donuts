import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {ValidationService} from '../../../providers/services/validation-service';


/**
 * Generated class for the AddAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html',
})
export class AddAddressPage {
  selected: any;
  feedback: number[];
  sec: boolean = false;
  addresses_country: any;
  addresses_state: any;
  edit_address: any = null;
  userForm: any;
  information: any;
  currentNumber: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public builder: FormBuilder) {
    this.edit_address = this.navParams.get('EditAddress');
    this.feedback = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.information = [{
      "name": "First Donut",
      "children": [
        {
          'id': '1',
          "name": "Special Academy Pizza",
          "information": "Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.",
          "price": "$25"
        },
        {
          'id': '2',
          "name": "Pizza Ionic",
          "information": "Pork chop meatloaf rump, meatball shoulder turducken alcatra doner sausage capicola pork strip steak turkey cupim leberkas.",
          "price": "$19.99"
        }
      ]
    },
      {
        "name": "Choose your coffee",
        "children": [
          {
            'id': '3',
            "name": "Special Academy Pizza",
            "information": " Landjaeger fatback shank frankfurter, tongue shoulder ham strip steak pancetta pork short loin corned beef short ribs biltong cow",
            "price": "$25"
          },
          {
            'id': '4',
            "name": "Pizza Ionic",
            "information": "Pork chop pastrami landjaeger chuck brisket",
            "price": "$19.99"
          }
        ]
      },
      {
        "name": "Coffee flavour",
        "children": [
          {
            "name": "Special Academy Pizza",
            "information": " Landjaeger fatback shank frankfurter, tongue shoulder ham strip steak pancetta pork short loin corned beef short ribs biltong cow",
            "price": "$25"
          },
          {
            "name": "Pizza Ionic",
            "information": "Pork chop pastrami landjaeger chuck brisket",
            "price": "$19.99"
          }
        ]
      },
      {
        "name": "Special instructions",
        "children": [
          {
            "name": "Special Academy Pizza",
            "information": " Landjaeger fatback shank frankfurter, tongue shoulder ham strip steak pancetta pork short loin corned beef short ribs biltong cow",
            "price": "$25"
          },
          {
            "name": "Pizza Ionic",
            "information": "Pork chop pastrami landjaeger chuck brisket",
            "price": "$19.99"
          }
        ]
      }]
    // Edit address 
    this.userForm = builder.group({
      'country': ['', [Validators.required]],
      'fname': ['', [ValidationService.nameValidator]],
      'lname': ['', [ValidationService.nameValidator]],
      'street': ['', [Validators.required]],
      'n_building': [''],
      'city': ['', [Validators.required]],
      'phone': ['', [Validators.required, ValidationService.phoneValidator]],
      'state': ['', [Validators.required]],
    })
  }

  ionViewDidLoad() {
    if (this.edit_address !== null && this.edit_address !== undefined) {
      this.userForm.controls['fname'].setValue(this.edit_address.fname);
      this.userForm.controls['lname'].setValue(this.edit_address.lname);
      this.userForm.controls['street'].setValue(this.edit_address.street);
      this.userForm.controls['n_building'].setValue(this.edit_address.n_building);
      this.userForm.controls['city'].setValue(this.edit_address.city);
      this.userForm.controls['phone'].setValue(this.edit_address.phone);
      this.addresses_state = this.edit_address.state;
      this.addresses_country = this.edit_address.country;
      this.userForm.controls['country'].setValue(this.edit_address.country);

    }
    //--------------
    console.log('ionViewDidLoad AddAddressPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  select(item) {
    this.selected = item;
  };

  isActive(item) {
    return this.selected === item;
  };

  onSubmit(value) {
    console.log(this.userForm.controls.fname.value);
    console.log(this.userForm.controls.lname.value);
    console.log(this.userForm.controls.street.value);
    console.log(this.userForm.controls.n_building.value);
    console.log(this.userForm.controls.city.value);
    console.log(this.userForm.controls.phone.value);
    console.log(this.userForm.controls.state.value);
    console.log(this.userForm.controls.country.value);
  }

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }

  func() {
    if (this.sec) {
      this.sec = false;
    }
    else {
      this.sec = true;
    }

  }

  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }

  increment() {
    this.currentNumber++;
  }

  decrement() {
    if (this.currentNumber <= 0) {

    }
    else {
      this.currentNumber--;
    }

  }

}
