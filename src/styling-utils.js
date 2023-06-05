/**
 * Get a property definiton containing settings for Font Family, Font Size and Color
 * @param {string} path
 * @param {object} fontResolver
 * @param {string} chartId
 * @param {object} theme
 * @returns {object} property definition object
 */
export const labelStylingDefinition = (path, fontResolver, chartId, theme) => {
  const pathFontFamily = `${path}.fontFamily`;
  const pathFontSize = `${path}.fontSize`;

  return {
    fontFamilyItem: {
      component: "dropdown",
      ref: pathFontFamily,
      options: () => fontResolver.getOptions(pathFontFamily),
      defaultValue: () => fontResolver.getDefaultValue(pathFontFamily),
    },
    fontWrapperItem: {
      component: "inline-wrapper",
      items: {
        fontSizeItem: {
          component: "dropdown",
          ref: pathFontSize,
          options: () => fontResolver.getOptions(pathFontSize),
          defaultValue: () => fontResolver.getDefaultValue(pathFontSize),
        },
        fontColorItem: {
          component: "color-picker",
          width: false,
          ref: `${path}.fontColor`,
          defaultValue: () => ({
            color: theme.getStyle(chartId, path, "color"),
          }),
        },
      },
    },
  };
};

export const getAxisLabelStyle = (theme, layout, flags) => {
  const axis = flags.isEnabled("CLIENT_IM_2022") ? (layout.components || []).find((c) => c.key === "axis") : {};
  return axis && axis.axis && axis.axis.label && axis.axis.label.name
    ? {
        fontSize: axis.axis.label.name.fontSize,
        fontFamily: axis.axis.label.name.fontFamily,
        fill: axis.axis.label.name.fontColor
          ? axis.axis.label.name.fontColor.color
          : theme.getStyle("object", "axis.label", "color"),
      }
    : {};
};

export const getValueLabelStyle = (theme, layout, flags) => {
  const valueLabel = flags.isEnabled("CLIENT_IM_2022") ? (layout.components || []).find((c) => c.key === "value") : {};
  return valueLabel && valueLabel.label && valueLabel.label.value
    ? {
        fontFamily: valueLabel.label.value.fontFamily,
        fontSize: parseFloat(valueLabel.label.value.fontSize),
        fill: valueLabel.label.value.fontColor
          ? valueLabel.label.value.fontColor.color
          : theme.getStyle("object", "label.value", "color"),
      }
    : {};
};

export const getLegendTitleStyle = (theme, layout, flags) => {
  const legend = flags.isEnabled("CLIENT_IM_3051") ? (layout.components || []).find((c) => c.key === "legend") : {};
  const title = legend && legend.legend && legend.legend.title;
  const style = {
    fontFamily: (title && title.fontFamily) || theme.getStyle("object", "legend.title", "fontFamily"),
    fontSize: (title && title.fontSize) || theme.getStyle("object", "legend.title", "fontSize"),
    color: (title && title.fontColor && title.fontColor.color) || theme.getStyle("object", "legend.title", "color"),
  };

  return style;
};

export const getLegendLabelStyle = (theme, layout, flags) => {
  const legend = flags.isEnabled("CLIENT_IM_3051") ? (layout.components || []).find((c) => c.key === "legend") : {};
  const label = legend && legend.legend && legend.legend.label;
  const style = {
    fontFamily: (label && label.fontFamily) || theme.getStyle("object", "legend.label", "fontFamily"),
    fontSize: (label && label.fontSize) || theme.getStyle("object", "legend.label", "fontSize"),
    color: (label && label.fontColor && label.fontColor.color) || theme.getStyle("object", "legend.label", "color"),
  };

  return style;
};

export default { labelStylingDefinition };
