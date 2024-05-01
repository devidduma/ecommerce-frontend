import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {CartService} from "../../services/cart.service";
import {Luv2ShopFormService} from "../../services/luv2-shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private cartService: CartService,
              private luv2ShopFormService: Luv2ShopFormService,
              ) {}

  ngOnInit() {
    this.cartPriceQuantity();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl("", [Validators.required,
          Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl("", [Validators.required,
          Validators.minLength(2)]),
        email: new FormControl("", [Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl("",
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        city: new FormControl("",
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        state: new FormControl("",
          [
            Validators.required
          ]),
        country: new FormControl("",
          [
            Validators.required
          ]),
        zipCode: new FormControl("",
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ])
      }),
      billingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipCode: [""]
      }),
      creditCard: this.formBuilder.group({
        cardType: [""],
        nameOnCard: [""],
        cardNumber: [""],
        securityCode: [""],
        expirationMonth: [""],
        expirationYear: [""],
      }),

    });
    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }

  private cartPriceQuantity() {
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    // compute cart total price and quantity
    this.cartService.computeCartTotals();
  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get("customer")!.value);
    console.log("The email address is " + this.checkoutFormGroup.get("customer")!.value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get("shippingAddress")!.value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get("shippingAddress")!.value.state.name);
  }

  get firstName() {
    return this.checkoutFormGroup.get("customer.firstName")!;
  }

  get lastName() {
    return this.checkoutFormGroup.get("customer.lastName")!;
  }

  get email() {
    return this.checkoutFormGroup.get("customer.email")!;
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get("shippingAddress.street")!;
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get("shippingAddress.city")!;
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get("shippingAddress.state")!;
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get("shippingAddress.zipCode")!;
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get("shippingAddress.country")!;
  }

  copyShippingAddressToBillingAddress(event: any) {
    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  // populate credit card years

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);

    // if the current year equals the selected year, then start with current month

    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup!.value.country.code;
    const countryName = formGroup!.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === "shippingAddress") {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup!.get("state")!.setValue(data[0]);
      }
    );
  }

  checkRequired(abstractControl: AbstractControl) {
    let errors = abstractControl!.errors!;
    return errors['required'];
  }

  checkMinLength(abstractControl: AbstractControl) {
    let errors = abstractControl!.errors!;
    return errors['minLength'];
  }

  checkPattern(abstractControl: AbstractControl) {
    let errors = abstractControl!.errors!;
    return errors['pattern'];
  }

  checkNotOnlyWhitespace(abstractControl: AbstractControl) {
    let errors = abstractControl!.errors!;
    return errors['notOnlyWhitespace'];
  }
}
