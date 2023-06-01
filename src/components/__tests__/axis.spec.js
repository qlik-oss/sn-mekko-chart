import axis from '../axis';

describe('axis', () => {
  const axisLabelStyle = {
    fontSize: '12px',
    fontFamily: 'MyFontFamily',
    fill: 'black',
  };

  it('should not have valueLabelStyle on when layout does not have components', () => {
    const a = axis({});
    const yAxis = a.find((x) => x.key === 'y-axis');
    expect(yAxis.settings.labels).to.eql({});
    const xAxis = a.find((x) => x.key === 'x-axis');
    expect(xAxis.settings.labels).to.eql({});
  });

  it('should have valueLabelStyle on y-axis', () => {
    const a = axis(axisLabelStyle);
    const yAxis = a.find((x) => x.key === 'y-axis');
    expect(yAxis.settings.labels.fontFamily).to.eql('MyFontFamily');
    expect(yAxis.settings.labels.fontSize).to.eql('12px');
    expect(yAxis.settings.labels.fill).to.eql('black');
  });

  it('should have valueLabelStyle on x-axis', () => {
    const a = axis(axisLabelStyle);
    const xAxis = a.find((x) => x.key === 'x-axis');
    expect(xAxis.settings.labels.fontFamily).to.eql('MyFontFamily');
    expect(xAxis.settings.labels.fontSize).to.eql('12px');
    expect(xAxis.settings.labels.fill).to.eql('black');
  });
});
