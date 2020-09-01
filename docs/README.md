📢 Use this project, [contribute](https://github.com/vtex-apps/location-availability) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Location Availability

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

This app provides availability and shipping information based on User's location, if available at the session, to have a more accurate result, even without authentication, we recommend using this app along with `vtex.shopper-location`, you can find more information about this app (here)[https://github.com/vtex-apps/shopper-location].

![Shelf](./images/shelf.png)

## Configuration

1. [Install](https://vtex.io/docs/recipes/development/installing-an-app/) the Quickorder app by running `vtex install vtex.location-availability@0.x`.
2. Open your store's Store Theme app directory in your code editor.
3. Add the Quickorder app as a `peerDependency` in the `manifest.json` file:

```diff
 "peerDependencies": {
+  "vtex.location-availability": "0.x"
 }
```

Now, you are able to use the block `product-location-availability` exported by the `location-availability` app. Check the props below:

### `product-location-availability` props

| Prop name  | Type     | Description                                    | Default value |
| ---------- | -------- | ---------------------------------------------- | ------------- |
| `maxItems` | `number` | Maximum number of shipping options per product | `2`           |

### Example

```diff
  ...
  "product-summary.shelf#home": {
    "children": [
      "product-summary-image#home",
      "product-summary-name",
+     "product-location-availability",
      "product-summary-sku-selector",
      "flex-layout.row#product-price"
    ]
  },
+  "product-location-availability": {
+    "props": {
+      "maxItems": 2
+    }
+  }
...
```

## Modus Operandi

This app is a complement to the availability information for the products, it shows different shipping options for the products.

It's a common practice for the biggest B2C players, this helps customers on the buying decision

## Customization

`In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).`

| CSS Handles              |
| ------------------------ |
| `container`              |
| `shippingOption`         |
| `postalCode`             |
| `regularShippingLabel`   |
| `regularShipping`        |
| `time`                   |
| `ETA`                    |
| `firstShippingOption`    |
| `freeShippingLabel`      |
| `freeShipping`           |
| `cannotBeDeliveredLabel` |
| `cannotBeDelivered`      |
| `pickUpLabel`            |
| `pickUp`                 |
| `getTomorrow`            |
| `getInDays`              |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
