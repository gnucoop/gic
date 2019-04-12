## Single Selection

```html
<ion-list>
  <ion-list-header>Single Selection</ion-list-header>

  <ion-item>
    <ion-label>Gender</ion-label>
    <gic-select placeholder="Select One">
      <gic-select-option value="f">Female</gic-select-option>
      <gic-select-option value="m">Male</gic-select-option>
    </gic-select>
  </ion-item>

  <ion-item>
    <ion-label>Hair Color</ion-label>
    <gic-select value="brown" okText="Okay" cancelText="Dismiss">
      <gic-select-option value="brown">Brown</gic-select-option>
      <gic-select-option value="blonde">Blonde</gic-select-option>
      <gic-select-option value="black">Black</gic-select-option>
      <gic-select-option value="red">Red</gic-select-option>
    </gic-select>
  </ion-item>

</ion-list>
```

## Multiple Selection

```html
<ion-list>
  <ion-list-header>Multiple Selection</ion-list-header>

  <ion-item>
    <ion-label>Toppings</ion-label>
    <gic-select multiple="true" cancelText="Nah" okText="Okay!">
      <gic-select-option value="bacon">Bacon</gic-select-option>
      <gic-select-option value="olives">Black Olives</gic-select-option>
      <gic-select-option value="xcheese">Extra Cheese</gic-select-option>
      <gic-select-option value="peppers">Green Peppers</gic-select-option>
      <gic-select-option value="mushrooms">Mushrooms</gic-select-option>
      <gic-select-option value="onions">Onions</gic-select-option>
      <gic-select-option value="pepperoni">Pepperoni</gic-select-option>
      <gic-select-option value="pineapple">Pineapple</gic-select-option>
      <gic-select-option value="sausage">Sausage</gic-select-option>
      <gic-select-option value="Spinach">Spinach</gic-select-option>
    </gic-select>
  </ion-item>

  <ion-item>
    <ion-label>Pets</ion-label>
    <gic-select multiple="true">
      <gic-select-option value="bird" selected>Bird</gic-select-option>
      <gic-select-option value="cat">Cat</gic-select-option>
      <gic-select-option value="dog" selected>Dog</gic-select-option>
      <gic-select-option value="honeybadger">Honey Badger</gic-select-option>
    </gic-select>
  </ion-item>
</ion-list>
```

## Objects as Values

```html
<ion-list>
  <ion-list-header>Objects as Values (compareWith)</ion-list-header>
  
  <ion-item>
    <ion-label>Users</ion-label>
    <gic-select [compareWith]="compareWith">
      <gic-select-option *ngFor="let user of users">{{user.first + ' ' + user.last}}</gic-select-option>
    </gic-select>
  </ion-item>
</ion-list>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'select-example',
  templateUrl: 'select-example.html',
  styleUrls: ['./select-example.css'],
})
export class SelectExample {
  users: any[] = [
    {
      id: 1,
      first: 'Alice',
      last: 'Smith',
    },
    {
      id: 2,
      first: 'Bob',
      last: 'Davis',
    },
    {
      id: 3,
      first: 'Charlie',
      last: 'Rosenburg',
    }
  ];

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = compareWithFn;
}
```

## Interface Options

```html
<ion-list>
  <ion-list-header>Interface Options</ion-list-header>

  <ion-item>
    <ion-label>Alert</ion-label>
    <gic-select [interfaceOptions]="customAlertOptions" interface="alert" multiple="true" placeholder="Select One">
      <gic-select-option value="bacon">Bacon</gic-select-option>
      <gic-select-option value="olives">Black Olives</gic-select-option>
      <gic-select-option value="xcheese">Extra Cheese</gic-select-option>
      <gic-select-option value="peppers">Green Peppers</gic-select-option>
      <gic-select-option value="mushrooms">Mushrooms</gic-select-option>
      <gic-select-option value="onions">Onions</gic-select-option>
      <gic-select-option value="pepperoni">Pepperoni</gic-select-option>
      <gic-select-option value="pineapple">Pineapple</gic-select-option>
      <gic-select-option value="sausage">Sausage</gic-select-option>
      <gic-select-option value="Spinach">Spinach</gic-select-option>
    </gic-select>
  </ion-item>

  <ion-item>
    <ion-label>Popover</ion-label>
    <gic-select [interfaceOptions]="customPopoverOptions" interface="popover" placeholder="Select One">
      <gic-select-option value="brown">Brown</gic-select-option>
      <gic-select-option value="blonde">Blonde</gic-select-option>
      <gic-select-option value="black">Black</gic-select-option>
      <gic-select-option value="red">Red</gic-select-option>
    </gic-select>
  </ion-item>

  <ion-item>
    <ion-label>Action Sheet</ion-label>
    <gic-select [interfaceOptions]="customActionSheetOptions" interface="action-sheet" placeholder="Select One">
      <gic-select-option value="red">Red</gic-select-option>
      <gic-select-option value="purple">Purple</gic-select-option>
      <gic-select-option value="yellow">Yellow</gic-select-option>
      <gic-select-option value="orange">Orange</gic-select-option>
      <gic-select-option value="green">Green</gic-select-option>
    </gic-select>
  </ion-item>

</ion-list>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'select-example',
  templateUrl: 'select-example.html',
  styleUrls: ['./select-example.css'],
})
export class SelectExample {
  customAlertOptions: any = {
    header: 'Pizza Toppings',
    subHeader: 'Select your toppings',
    message: '$1.00 per topping',
    translucent: true
  };

  customPopoverOptions: any = {
    header: 'Hair Color',
    subHeader: 'Select your hair color',
    message: 'Only select your dominant hair color'
  };

  customActionSheetOptions: any = {
    header: 'Colors',
    subHeader: 'Select your favorite color'
  };
}
```