export const RESTRICTIONS = {
  HasNoData: {
    label: 'The selections generated no data for this chart.',
    translation: 'NoDataExist',
    type: 'disrupt',
  },
  HasOnlyNaNValues: {
    label: 'The chart is not displayed because it contains only undefined values.',
    translation: 'OnlyNaNData',
    type: 'disrupt',
  },
  HasOnlyNegativeOrZeroValues: {
    label: 'The chart is not displayed because it contains only negative or zero values.',
    translation: 'OnlyNegativeOrZeroValues',
    type: 'disrupt',
  },
  HasZeroOrNegativeValues: {
    label: 'The data set contains negative or zero values that cannot be shown in this chart.',
    translation: 'NegativeOrZeroValues',
    type: 'note',
  },
};

export function restriction(hc) {
  if (hc.qSize.qcy <= 0) {
    return RESTRICTIONS.HasNoData;
  }
  if (hc.qMeasureInfo[0].qMax === 'NaN') {
    return RESTRICTIONS.HasOnlyNaNValues;
  }
  if (hc.qMeasureInfo[0].qMax <= 0) {
    return RESTRICTIONS.HasOnlyNegativeOrZeroValues;
  }
  if (hc.qMeasureInfo[0].qMin <= 0) {
    return RESTRICTIONS.HasZeroOrNegativeValues;
  }
  return undefined;
}
