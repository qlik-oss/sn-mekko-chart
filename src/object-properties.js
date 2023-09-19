import { legendConfig } from "./coloring";
/**
 * @extends {EngineAPI.GenericObjectProperties}
 * @entry
 */
const properties = {
  /**
   * Current version of this generic object definition
   * @type {string}
   */
  version: process.env.PACKAGE_VERSION,
  /**
   * Extends `HyperCubeDef`, see Engine API: `HyperCubeDef`.
   * @extends {EngineAPI.HyperCubeDef}
   */
  qHyperCubeDef: {
    qInitialDataFetch: [
      {
        qWidth: 3,
        qHeight: 3333,
      },
    ],
    /** @type {boolean} */
    qSuppressZero: true,
    /** @type {boolean} */
    qSuppressMissing: true,
  },
  /**
   * Show title for the visualization.
   * @type {boolean=}
   */
  showTitles: true,
  /**
   * Visualization title.
   * @type {(string|EngineAPI.StringExpression)=}
   */
  title: "",
  /**
   * Visualization subtitle.
   * @type {(string|EngineAPI.StringExpression)=}
   */
  subtitle: "",
  /**
   * Visualization footnote.
   * @type {(string|EngineAPI.StringExpression)=}
   */
  footnote: "",
  /**
   * @type {object}
   * @property {byDimensionConfig} [byDimension=byDimensionConfig]
   */
  cellColor: {
    /**
     * @type {'auto'|'byDimension'}
     */
    mode: "auto",
    /**
     * @type {legendConfig}
     */
    legend: legendConfig,
  },
};

export default properties;
