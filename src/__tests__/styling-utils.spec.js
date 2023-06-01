import {
  getAxisLabelStyle,
  getLegendLabelStyle,
  getLegendTitleStyle,
  getValueLabelStyle,
  labelStylingDefinition,
} from '../styling-utils';

describe('Label styling definition', () => {
  it('should get correct label styling definition refs', () => {
    const path = 'example.path';
    const chartId = 'mekkochart';
    const mockFontResolver = {
      getOptions: () => {
        ['font1', 'font2', 'font3'];
      },
      getDefaultValue: () => {
        'defaultValue';
      },
    };
    const mockTheme = {
      getStyle: () => {
        'green';
      },
    };
    const definition = labelStylingDefinition(path, mockFontResolver, chartId, mockTheme);

    expect(definition.fontFamilyItem.ref).equal('example.path.fontFamily');
    expect(definition.fontWrapperItem.items.fontSizeItem.ref).equal('example.path.fontSize');
    expect(definition.fontWrapperItem.items.fontColorItem.ref).equal('example.path.fontColor');
  });
});

describe('Styling options', () => {
  let theme;
  let layout;
  let flags;

  beforeEach(() => {
    flags = {
      isEnabled: () => true,
    };
    layout = {};
    theme = {
      getStyle: () => {},
    };
  });

  it('should get corrext getAxisLabelStyle', () => {
    const component = {
      key: 'axis',
      axis: {
        label: { name: { fontFamily: 'aLabelFont, sans-serif', fontSize: '2000', fontColor: { color: 'green' } } },
      },
    };
    layout.components = [component];
    const style = getAxisLabelStyle(theme, layout, flags);
    expect(style.fontFamily).eql('aLabelFont, sans-serif');
    expect(style.fontSize).eql('2000');
    expect(style.fill).eql('green');
  });

  it('should get corrext getValueLabelStyle', () => {
    const component = {
      key: 'value',
      label: { value: { fontFamily: 'vLabelFont, sans-serif', fontSize: '3000', fontColor: { color: 'blue' } } },
    };
    layout.components = [component];
    const style = getValueLabelStyle(theme, layout, flags);
    expect(style.fontFamily).eql('vLabelFont, sans-serif');
    expect(style.fontSize).eql(3000);
    expect(style.fill).eql('blue');
  });

  it('should get corrext getLegendTitleStyle', () => {
    const component = {
      key: 'legend',
      legend: { title: { fontFamily: 'lTitleFont, sans-serif', fontSize: '4000', fontColor: { color: 'purple' } } },
    };
    layout.components = [component];
    const style = getLegendTitleStyle(theme, layout, flags);
    expect(style.fontFamily).eql('lTitleFont, sans-serif');
    expect(style.fontSize).eql('4000');
    expect(style.color).eql('purple');
  });

  it('should get corrext getLegendLabelStyle', () => {
    const component = {
      key: 'legend',
      legend: { label: { fontFamily: 'lLabelFont, sans-serif', fontSize: '5000', fontColor: { color: 'yellow' } } },
    };
    layout.components = [component];
    const style = getLegendLabelStyle(theme, layout, flags);
    expect(style.fontFamily).eql('lLabelFont, sans-serif');
    expect(style.fontSize).eql('5000');
    expect(style.color).eql('yellow');
  });
});
