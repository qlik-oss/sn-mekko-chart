export const RESTRICTIONS = {
  HasNoData: {
    label: "The selections generated no data for this chart.",
    type: "disrupt",
  },
  HasOnlyNaNValues: {
    label:
      "The chart is not displayed because it contains only undefined values.",
    type: "disrupt",
  },
  HasOnlyNegativeOrZeroValues: {
    label:
      "The chart is not displayed because it contains only negative or zero values.",
    type: "disrupt",
  },
  HasLimitedDataset: {
    label: "Currently showing a limited data set.",
    type: "note",
  },
  HasZeroOrNegativeValues: {
    label:
      "The data set contains negative or zero values that cannot be shown in this chart.",
    type: "note",
  },
};

export function restriction(hc) {
  if (hc.qSize.qcy <= 0) {
    return RESTRICTIONS.HasNoData;
  }
  if (hc.qMeasureInfo[0].qMax === "NaN") {
    return RESTRICTIONS.HasOnlyNaNValues;
  }
  if (hc.qMeasureInfo[0].qMax <= 0) {
    return RESTRICTIONS.HasOnlyNegativeOrZeroValues;
  }
  if (hc.qDataPages[0].qArea.qHeight < hc.qSize.qcy) {
    return RESTRICTIONS.HasLimitedDataset;
  }
  if (hc.qMeasureInfo[0].qMin <= 0) {
    return RESTRICTIONS.HasZeroOrNegativeValues;
  }
  return undefined;
}
