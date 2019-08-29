import picassojs from 'picasso.js';
import picassoQ from 'picasso-plugin-q';

import properties from './object-properties';
import data from './data';
import picSelections from './pic-selections';
import definition from './pic-definition';
import colorFn from './color';
import ext from './ext';
import plugin from './component-definitions/disclaimer';

import { restriction, RESTRICTIONS } from './data-restrictions';

export default function supernova(/* env */) {
  const picasso = picassojs();
  picasso.use(picassoQ);
  picasso.use(plugin);

  return {
    qae: {
      properties,
      data,
    },
    component: {
      created() {},
      mounted(element) {
        this.pic = picasso.chart({
          element,
          data: [],
          settings: {},
        });
        this.picsel = picSelections({
          selections: this.selections,
          brush: this.pic.brush('selection'),
          picassoQ,
        });
      },
      render({
        layout,
        context,
      }) {
        if (!this.color) {
          this.color = colorFn();
        }
        let hc = layout.qHyperCube;
        const restricted = restriction(hc);

        if (restricted === RESTRICTIONS.HasZeroOrNegativeValues) {
          const filteredMatrix = hc.qDataPages[0].qMatrix.filter(row => row[2].qNum > 0);
          hc = {
            ...layout.qHyperCube,
            qDataPages: [{
              qArea: {
                ...hc.qDataPages[0].qArea,
                qHeight: filteredMatrix.height,
              },
              qMatrix: filteredMatrix,
            }],
            qSize: {
              qcx: layout.qHyperCube.qSize.qcx,
              qcy: filteredMatrix.height,
            },
          };
        }

        this.pic.update({
          data: [{
            type: 'q',
            key: 'qHyperCube',
            data: hc,
          }],
          settings: definition({
            layout,
            context,
            color: this.color,
            restricted,
          }),
        });
      },
      resize() {},
      willUnmount() {},
      destroy() {},
    },
    ext,
  };
}
