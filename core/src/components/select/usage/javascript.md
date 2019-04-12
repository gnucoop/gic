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
    <gic-select value="brown" ok-text="Okay" cancel-text="Dismiss">
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
    <gic-select multiple="true" cancel-text="Nah" ok-text="Okay!">
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
    <gic-select id="objectSelectCompareWith"></gic-select>
  </ion-item>
</ion-list>
```

```javascript
  let objectOptions = [
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

  let compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  let objectSelectElement = document.getElementById('objectSelectCompareWith');
  objectSelectElement.compareWith = compareWithFn;
  
  objectOptions.forEach((option, i) => {
    let selectOption = document.createElement('gic-select-option');
    selectOption.value = option;
    selectOption.textContent = option.first + ' ' + option.last;
    selectOption.selected = (i === 0);
    
    objectSelectElement.appendChild(selectOption)
  });
}
```

## Interface Options

```html
<ion-list>
  <ion-list-header>Interface Options</ion-list-header>

  <ion-item>
    <ion-label>Alert</ion-label>
    <gic-select id="customAlertSelect" interface="alert" multiple="true" placeholder="Select One">
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
    <gic-select id="customPopoverSelect" interface="popover" placeholder="Select One">
      <gic-select-option value="brown">Brown</gic-select-option>
      <gic-select-option value="blonde">Blonde</gic-select-option>
      <gic-select-option value="black">Black</gic-select-option>
      <gic-select-option value="red">Red</gic-select-option>
    </gic-select>
  </ion-item>

  <ion-item>
    <ion-label>Action Sheet</ion-label>
    <gic-select id="customActionSheetSelect" interface="action-sheet" placeholder="Select One">
      <gic-select-option value="red">Red</gic-select-option>
      <gic-select-option value="purple">Purple</gic-select-option>
      <gic-select-option value="yellow">Yellow</gic-select-option>
      <gic-select-option value="orange">Orange</gic-select-option>
      <gic-select-option value="green">Green</gic-select-option>
    </gic-select>
  </ion-item>

</ion-list>
```

```javascript
var customAlertSelect = document.getElementById('customAlertSelect');
var customAlertOptions = {
  header: 'Pizza Toppings',
  subHeader: 'Select your toppings',
  message: '$1.00 per topping',
  translucent: true
};
customAlertSelect.interfaceOptions = customAlertOptions;

var customPopoverSelect = document.getElementById('customPopoverSelect');
var customPopoverOptions = {
  header: 'Hair Color',
  subHeader: 'Select your hair color',
  message: 'Only select your dominant hair color'
};
customPopoverSelect.interfaceOptions = customPopoverOptions;

var customActionSheetSelect = document.getElementById('customActionSheetSelect');
var customActionSheetOptions = {
  header: 'Colors',
  subHeader: 'Select your favorite color'
};
customActionSheetSelect.interfaceOptions = customActionSheetOptions;
```