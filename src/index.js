import picassojs from 'picasso.js';
import picassoQ from 'picasso-plugin-q';

import properties from './object-properties';
import data from './data';
import picSelections from './pic-selections';
import definition from './pic-definition';
import contrasterFn from './coloring/contraster';
import ext from './ext';
import plugin from './component-definitions/disclaimer';

import { restriction, RESTRICTIONS } from './data-restrictions';

import chartColorConfig from './coloring';

import picassoColoring from './coloring/picasso';
import theme from './theme';

export default function supernova(/* env */) {
  const picasso = picassojs();
  picasso.use(picassoQ);
  picasso.use(plugin);

  return {
    qae: {
      properties: {
        initial: properties,
        onChange(p) {
          chartColorConfig({
            properties: p,
          }).update();
        },
      },
      data,
    },
    component: {
      created() {
        this.picassoColoring = picassoColoring({
          picasso,
        });

        this.contraster = contrasterFn();
      },
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

        const c = chartColorConfig({
          layout,
          theme: theme(),
        });

        this.picassoColoring.config({
          key: 'asd',
          source: 'qHyperCube',
          hc,
          chartColorModel: c,
          permissions: context.permissions,
        });

        this.pic.update({
          data: [{
            type: 'q',
            key: 'qHyperCube',
            data: hc,
          }, ...this.picassoColoring.data()],
          settings: definition({
            layout,
            context,
            contraster: this.contraster,
            picassoColoring: this.picassoColoring,
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
