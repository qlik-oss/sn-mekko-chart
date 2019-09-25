import { legendConfig } from './coloring';
/**
 * @typedef {object}
 * @entry
 */
const properties = {
  /**
   * Current version of this generic object definition
   * @type {string}
   */
  version: '1.0.0',
  /**
   * @typedef
   */
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [],
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
    /** @type {NxCalcCond} */
    qCalcCondition: undefined,
  },
  /**
   * @type {boolean=}
   */
  showTitles: true,
  /**
   * @type {string=}
   */
  title: '',
  /**
   * @type {string=}
   */
  subtitle: '',
  /**
   * @type {string=}
   */
  footnote: '',
  /**
   * @typedef {object}
   * @property {byDimensionConfig} byDimension
   */
  cellColor: {
    /**
     * @type {'auto'|'byDimension'}
     */
    mode: 'auto',
    /**
     * @type {legendConfig}
     */
    legend: legendConfig,
  },
};

export default properties;
