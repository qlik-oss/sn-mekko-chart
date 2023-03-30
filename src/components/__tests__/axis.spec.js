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
    isEnabled: () => true,
  };

  it('should not have valueLabelStyle on when layout does not have components', () => {
    const a = axis({}, flags);
    const yAxis = a.find((x) => x.key === 'y-axis');
    expect(yAxis.settings).to.eql(undefined);
    const xAxis = a.find((x) => x.key === 'x-axis');
    expect(xAxis.settings).to.eql(undefined);
  });

  it('should have valueLabelStyle on y-axis', () => {
    const a = axis(layout, flags);
    const yAxis = a.find((x) => x.key === 'y-axis');
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
