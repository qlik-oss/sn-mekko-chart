export const legendShow = (legendProps, hc, coloring) => {
  if (
    coloring.invalid ||
    coloring.type === "color" ||
    (coloring.mode === "measure" && hc.qMeasureInfo.length <= 1) ||
    coloring.mode === "dimension"
  ) {
    return false;
  }

  return legendProps.show !== false;
};

export function catLegend(componentConfig, opts) {
  const { key } = componentConfig;

  const { scaleKey, scales, coloring, hc, constraints, styleOptions } = opts;

  const s = `${scaleKey}Legend`;

  return {
    type: "legend-cat",
    key: `${key}-cat`,
    scale: s in scales ? s : scaleKey,
    show: legendShow(opts.legendConfig, hc, coloring),
    layout: {
      minimumLayoutMode: "MEDIUM",
      dock: opts.legendConfig.dock,
    },
    settings: {
      item: {
        show: (d) => d.datum.value !== -2,
        label: {
          fontSize: styleOptions.label.fontSize,
          fontFamily: styleOptions.label.fontFamily,
          fill: styleOptions.label.color,
        },
      },
      title: {
        wordBreak: "break-word",
        maxLines: 2,
        text: coloring.label || "",
        show: opts.legendConfig.showTitle !== false,
        fontSize: styleOptions.title.fontSize,
        fontFamily: styleOptions.title.fontFamily,
        fill: styleOptions.title.color,
      },
      navigation: {
        disabled: constraints.active,
      },
    },
    brush: {
      trigger:
        !coloring.locked && !constraints.active && !constraints.select
          ? [
              {
                contexts: ["selection"],
                data: ["", key],
              },
            ]
          : [],
      consume: [
        {
          context: "selection",
          data: ["", key],
          style: {
            inactive: {
              opacity: 0.3,
            },
          },
        },
      ],
    },
  };
}

export default function legend(componentConfig, opts) {
  if (opts.coloring.type === "categorical") {
    return catLegend(componentConfig, opts);
  }
  return false;
}
