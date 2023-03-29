import palettes from './palettes';
import scales from './scales';
import colorFn from './fill';
import legend from './legend';
import datumProps from './datum';

/**
 * Creates a new coloring model
 *
 * @private
 * @param {object} resources
 * @param {picasso} resources.picasso
 * @returns {coloring}
 */
export default function coloringFn(resources) {
  let inputCache = {};
  let calculatedCache = {};

  let chartColorModel;

  const getSettings = () => {
    if (!calculatedCache.settings) {
      calculatedCache.settings = chartColorModel.getSettings();
    }
    return calculatedCache.settings;
  };

  /**
   * @typedef {object} coloring
   * @private
   */
  const c = /** @lends coloring */ {
    /**
     * Configure this coloring model
     * @param {object} cfg
     * @param {string} cfg.key
     * @param {object} cfg.chartColorModel
     * @param {QAE.HyperCube} cfg.hc
     * @param {object} cfg.constraints
     */
    config(cfg) {
      inputCache = { ...cfg };
      calculatedCache = {};

      chartColorModel = inputCache.chartColorModel; // eslint-disable-line

      if (!inputCache.key) {
        throw new Error('Missing key');
      }
    },

    /**
     * @returns {string}
     */
    resolveUIColor(co) {
      return chartColorModel.resolveUIColor(co);
    },

    /**
     * @returns {object} coloring~settings
     */
    settings() {
      const s = getSettings();
      return {
        mode: s.mode,
        type: s.type,
        label: s.label,
        field: s.field,
        fieldType: s.fieldType,
        nil: s.nil,
        others: s.others,
        primary: s.primary,
      };
    },

    // -- picasso inputs --

    /**
     * @returns {array<palette>}
     */
    palettes() {
      return palettes({
        coloring: getSettings(),
      });
    },

    /**
     * @returns {object<string,scale>}
     */
    scales() {
      calculatedCache.scales =
        calculatedCache.scales ||
        scales({
          hc: inputCache.hc,
          coloring: getSettings(),
          key: inputCache.key,
          source: inputCache.source,
          picasso: resources.picasso,
        });
      return calculatedCache.scales;
    },

    /**
     * @returns {function}
     */
    color() {
      calculatedCache.color =
        calculatedCache.color ||
        colorFn({
          coloring: getSettings(),
          scales: this.scales(),
          key: inputCache.key,
        });

      return calculatedCache.color;
    },

    /**
     * @param {number} midx
     * @returns {object<string,datumProp>}
     */
    datumProps(midx) {
      return datumProps(
        {
          coloring: getSettings(),
          scales: this.scales(),
          key: inputCache.key,
          hc: inputCache.hc,
        },
        midx
      );
    },

    /**
     * @returns {data[]}
     */
    data() {
      return [
        {
          key: 'dummy',
          data: [['field'], ['a']],
        },
      ];
    },

    /**
     * @param {object} cfg
     * @param {string} cfg.eventName
     * @param {string} cfg.key
     * @param {chart} [cfg.rtl]
     * @param {chart} [cfg.chart]
     * @param {object} [cfg.viewState]
     * @param {string} [cfg.styleReference='object.legend']
     * @returns {object}
     */
    legend({ eventName, key } = {}) {
      return legend(
        {
          eventName,
          key,
        },
        {
          legendConfig: chartColorModel.getLegendSettings(),
          scaleKey: inputCache.key,
          coloring: getSettings(),
          hc: inputCache.hc,
          scales: this.scales(),
          constraints: inputCache.constraints,
        }
      );
    },
  };

  return c;
}
