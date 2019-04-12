# gic-alert-controller



<!-- Auto Generated Below -->


## Methods

### `create(opts: AlertOptions) => Promise<HTMLIonAlertElement>`

Create an alert overlay with alert options

#### Parameters

| Name   | Type           | Description |
| ------ | -------------- | ----------- |
| `opts` | `AlertOptions` |             |

#### Returns

Type: `Promise<HTMLIonAlertElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open alert overlay.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |
| `id`   | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonAlertElement | undefined>`

Get the most recently opened alert overlay.

#### Returns

Type: `Promise<HTMLIonAlertElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
