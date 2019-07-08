export default function axis() {
  return [{
    key: 'y-axis',
    type: 'axis',
    dock: 'left',
    scale: 'y',
    formatter: {
      type: 'd3-number',
      format: '.0%',
    },
  }, {
    key: 'x-axis',
    type: 'axis',
    dock: 'bottom',
    scale: 'm',
    formatter: {
      type: 'd3-number',
      format: '.0%',
    },
  }];
}
