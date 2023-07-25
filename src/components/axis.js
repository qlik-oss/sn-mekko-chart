export default function axis(axisLabelStyle) {
  return [
    {
      key: "y-axis",
      type: "axis",
      layout: {
        minimumLayoutMode: "WIDTH_MEDIUM",
        dock: "left",
      },
      scale: "y",
      formatter: {
        type: "d3-number",
        format: ".0%",
      },
      settings: {
        labels: axisLabelStyle,
      },
    },
    {
      key: "x-axis",
      type: "axis",
      layout: {
        minimumLayoutMode: "HEIGHT_MEDIUM",
        dock: "bottom",
      },
      scale: "m",
      formatter: {
        type: "d3-number",
        format: ".0%",
      },
      settings: {
        labels: axisLabelStyle,
      },
    },
  ];
}
