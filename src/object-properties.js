/**
 * @typedef {object}
 */
const properties = {
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
  color: {
    /**
     * @type {'auto'|'byDimension'}
     */
    mode: 'auto',
  },
};

export default properties;
