# gic-alert



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                                                                                                                                                                                                                                                                                                                        | Type                                                    | Default     |
| ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------- |
| `animated`         | `animated`           | If `true`, the alert will animate.                                                                                                                                                                                                                                                                                                 | `boolean`                                               | `true`      |
| `backdropDismiss`  | `backdrop-dismiss`   | If `true`, the alert will be dismissed when the backdrop is clicked.                                                                                                                                                                                                                                                               | `boolean`                                               | `true`      |
| `buttons`          | --                   | Array of buttons to be added to the alert.                                                                                                                                                                                                                                                                                         | `(string \| AlertButton)[]`                             | `[]`        |
| `cssClass`         | `css-class`          | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces.                                                                                                                                                                                                                   | `string \| string[] \| undefined`                       | `undefined` |
| `enterAnimation`   | --                   | Animation to use when the alert is presented.                                                                                                                                                                                                                                                                                      | `((baseEl: any, opts?: any) => Animation) \| undefined` | `undefined` |
| `header`           | `header`             | The main title in the heading of the alert.                                                                                                                                                                                                                                                                                        | `string \| undefined`                                   | `undefined` |
| `inputs`           | --                   | Array of input to show in the alert.                                                                                                                                                                                                                                                                                               | `AlertInput[]`                                          | `[]`        |
| `keyboardClose`    | `keyboard-close`     | If `true`, the keyboard will be automatically dismissed when the overlay is presented.                                                                                                                                                                                                                                             | `boolean`                                               | `true`      |
| `leaveAnimation`   | --                   | Animation to use when the alert is dismissed.                                                                                                                                                                                                                                                                                      | `((baseEl: any, opts?: any) => Animation) \| undefined` | `undefined` |
| `message`          | `message`            | The main message to be displayed in the alert. `message` can accept either plaintext or HTML as a string. To display characters normally reserved for HTML, they must be escaped. For example `<Ionic>` would become `&lt;Ionic&gt;`  For more information: [Security Documentation](https://ionicframework.com/docs/faq/security) | `string \| undefined`                                   | `undefined` |
| `mode`             | `mode`               | The mode determines which platform styles to use.                                                                                                                                                                                                                                                                                  | `"ios" \| "md"`                                         | `undefined` |
| `searchBar`        | `search-bar`         | If `true`, the alert will show a searchbar for radios and checkboxes                                                                                                                                                                                                                                                               | `boolean`                                               | `false`     |
| `searchString`     | `search-string`      | The current search string                                                                                                                                                                                                                                                                                                          | `null \| string \| undefined`                           | `''`        |
| `subHeader`        | `sub-header`         | The subtitle in the heading of the alert. Displayed under the title.                                                                                                                                                                                                                                                               | `string \| undefined`                                   | `undefined` |
| `translucent`      | `translucent`        | If `true`, the alert will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).                                                                                                               | `boolean`                                               | `false`     |
| `useVirtualScroll` | `use-virtual-scroll` | If `true`, the alert will use a virtual scroll to render radios and checkboxes                                                                                                                                                                                                                                                     | `boolean`                                               | `false`     |


## Events

| Event                 | Description                             | Type                                   |
| --------------------- | --------------------------------------- | -------------------------------------- |
| `gicAlertDidDismiss`  | Emitted after the alert has dismissed.  | `CustomEvent<OverlayEventDetail<any>>` |
| `gicAlertDidPresent`  | Emitted after the alert has presented.  | `CustomEvent<void>`                    |
| `gicAlertWillDismiss` | Emitted before the alert has dismissed. | `CustomEvent<OverlayEventDetail<any>>` |
| `gicAlertWillPresent` | Emitted before the alert has presented. | `CustomEvent<void>`                    |


## Methods

### `dismiss(data?: any, role?: string | undefined) => Promise<boolean>`

Dismiss the alert overlay after it has been presented.

#### Returns

Type: `Promise<boolean>`



### `onDidDismiss() => Promise<OverlayEventDetail>`

Returns a promise that resolves when the alert did dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `onWillDismiss() => Promise<OverlayEventDetail>`

Returns a promise that resolves when the alert will dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `present() => Promise<void>`

Present the alert overlay after it has been created.

#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name           | Description                 |
| -------------- | --------------------------- |
| `--background` | Background of the alert     |
| `--height`     | Height of the alert         |
| `--max-height` | Maximum height of the alert |
| `--max-width`  | Maximum width of the alert  |
| `--min-height` | Minimum height of the alert |
| `--min-width`  | Minimum width of the alert  |
| `--width`      | Width of the alert          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
