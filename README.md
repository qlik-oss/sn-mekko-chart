# sn-mekko-chart

A basic mekko chart supernova aimed to be used in [nebula.js](https://github.com/qlik-oss/nebula.js).

![mekko chart preview](./assets/sn-mekko-chart.png)

```js

import { embed } from '@nebula.js/stardust';
import mekko from '@nebula.js/sn-mekko-chart';

// 'app' is an enigma app model
const embeddable = embed(app, {
  types: [{ // register the mekko chart
    name: 'mekko',
    load: () => Promise.resolve(mekko);
  }]
});

embedable.render({
  element,
  type: 'mekko',
  fields: ['Region', 'Fiscal Year', '=Sum(Sales)'],
});
```

## Requirements

Requires `@nebula.js/stardust` version `>=1.7.0`.

## Installing

If you use npm: `npm install @nebula.js/sn-mekko-chart`. You can also load through the script tag directly from any of the CDNs that supports NPM packages, for example: [unpkg](https://unpkg.com/@nebula.js/sn-mekko-chart).

## More examples

### Color by dimension

In this example the first dimension (Region) is used to color each cell.

![mekko chart color by dimension](./assets/sn-mekko-chart-color-by-dim.png)

```js
embedable.render({
  element,
  type: 'mekko',
  fields: ['Region', 'Fiscal Year', '=Sum(Sales)'],
  properties: {
    cellColor: {
      mode: 'byDimension',
      byDimension: { type: 'index', typeValue: 0 },
    },
  },
});
```

## API

The API specifiction is available at [Qlik Developer Portal](https://qlik.dev/apis/javascript/nebula-mekko-chart)