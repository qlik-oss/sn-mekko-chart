import picassoQ from "picasso-plugin-q";
import picassojs from "picasso.js";

import {
  useAppLayout,
  useConstraints,
  useEffect,
  useElement,
  useOptions,
  useRect,
  useSelections,
  useStaleLayout,
  useState,
  useTheme,
  useTranslator,
} from "@nebula.js/stardust";

import contrasterFn from "./coloring/contraster";
import plugin from "./component-definitions/disclaimer";
import data from "./data";
import ext from "./ext";
import properties from "./object-properties";
import definition from "./pic-definition";
import picSelections from "./pic-selections";

import { restriction, RESTRICTIONS } from "./data-restrictions";
import REFS from "./refs";

import chartColorConfig from "./coloring";

import globeTrotter from "../locales/all";
import picassoColoringFn from "./coloring/picasso";

export default function supernova(env) {
  const picasso = picassojs();
  picasso.use(picassoQ);
  picasso.use(plugin);

  Object.keys(globeTrotter).forEach((key) => {
    env.translator.add(globeTrotter[key]);
  });

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
      data: data(env),
    },
    component: () => {
      const layout = useStaleLayout();
      const element = useElement();
      const selections = useSelections();
      const appLayout = useAppLayout();
      const rect = useRect();
      const [pic, setPic] = useState();
      const constraints = useConstraints();
      const translator = useTranslator();

      const localeInfo = appLayout.qLocaleInfo;
      const theme = useTheme();

      const { renderer } = useOptions();

      useEffect(() => {
        const p = picasso({
          renderer: {
            prio: [renderer || "canvas"],
          },
        }).chart({
          element,
          data: [],
          settings: {},
        });
        const s = picSelections({
          selections,
          brush: p.brush("selection"),
          picassoQ,
        });

        setPic(p);
        return () => {
          s.release();
          p.destroy();
        };
      }, []);

      const [contraster] = useState(() => contrasterFn());

      const [picassoColoring] = useState(() =>
        picassoColoringFn({
          picasso,
        }),
      );

      useEffect(() => {
        if (!pic) {
          return;
        }
        let hc = layout.qHyperCube;
        const restricted = restriction(hc);

        if (restricted === RESTRICTIONS.HasZeroOrNegativeValues) {
          const filteredMatrix = hc.qDataPages[0].qMatrix.filter((row) => row[2].qNum > 0);
          hc = {
            ...layout.qHyperCube,
            qDataPages: [
              {
                qArea: {
                  ...hc.qDataPages[0].qArea,
                  qHeight: filteredMatrix.height,
                },
                qMatrix: filteredMatrix,
              },
            ],
            qSize: {
              qcx: layout.qHyperCube.qSize.qcx,
              qcy: filteredMatrix.height,
            },
          };
        }

        const c = chartColorConfig({
          layout,
          theme,
        });

        picassoColoring.config({
          key: REFS.CELL_COLOR,
          source: "qHyperCube",
          hc,
          chartColorModel: c,
          constraints,
        });

        const formatPercentage = (v) =>
          `${(v * 100).toFixed(1)}%`.replace(".", localeInfo ? localeInfo.qDecimalSep : ".");

        pic.update({
          data: [
            {
              type: "q",
              key: "qHyperCube",
              data: hc,
              config: {
                localeInfo,
              },
            },
            ...picassoColoring.data(),
          ],
          settings: definition({
            layout,
            theme,
            contraster,
            picassoColoring,
            restricted,
            translator,
            constraints,
            formatPercentage,
            flags: env.flags,
          }),
        });
      }, [layout, pic, constraints, theme.name(), translator.language()]);

      useEffect(() => {
        pic && pic.update();
      }, [rect.width, rect.height]);
    },
    ext: ext(env),
  };
}
