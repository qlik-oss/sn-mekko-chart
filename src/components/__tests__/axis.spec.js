import axis from '../axis';

describe('axis', () => {
  const layout = {
    components: [
      {
        key: 'axis',
        axis: {
          label: {
            name: {
              fontFamily: 'MyFontFamily',
              fontSize: '12px',
              fontColor: {
                color: 'black',
              },
            },
          },
        },
      },
    ],
  };
  const flags = {
    isEnabled: () => {
      return true;
    },
  };

  it('should have valueLabelStyle on y-axis', () => {
    const a = axis(layout, flags);
    const yAxis = a.find((x) => x.key === 'y-axis');
    console.log(yAxis);
    expect(yAxis.settings.labels.fontFamily).to.eql('MyFontFamily');
    expect(yAxis.settings.labels.fontSize).to.eql('12px');
    expect(yAxis.settings.labels.fill).to.eql('black');
  });

  it('should have valueLabelStyle on x-axis', () => {
    const a = axis(layout, flags);
    const xAxis = a.find((x) => x.key === 'x-axis');
    expect(xAxis.settings.labels.fontFamily).to.eql('MyFontFamily');
    expect(xAxis.settings.labels.fontSize).to.eql('12px');
    expect(xAxis.settings.labels.fill).to.eql('black');
  });
});
