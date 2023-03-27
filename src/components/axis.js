export default function axis(layout, flags) {
  const axisComponent = flags.isEnabled('CLIENT_IM_2022')
    ? (layout.components || []).find((c) => c.key === 'axis').axis
    : {};
  const labelStyle =
    axisComponent.label && axisComponent.label.name
      ? {
          settings: {
            labels: {
              fontSize: axisComponent.label.name.fontSize,
              fontFamily: axisComponent.label.name.fontFamily,
              fill: axisComponent.label.name.fontColor.color,
            },
          },
        }
      : {};
  return [
    {
      key: 'y-axis',
      type: 'axis',
      layout: {
        minimumLayoutMode: 'WIDTH_MEDIUM',
        dock: 'left',
      },
      scale: 'y',
      formatter: {
        type: 'd3-number',
        format: '.0%',
      },
      ...labelStyle,
    },
    {
      key: 'x-axis',
      type: 'axis',
      layout: {
        minimumLayoutMode: 'HEIGHT_MEDIUM',
        dock: 'bottom',
      },
      scale: 'm',
      formatter: {
        type: 'd3-number',
        format: '.0%',
      },
      ...labelStyle,
    },
  ];
}
