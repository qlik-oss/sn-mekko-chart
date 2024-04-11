import {
  getAxisLabelStyle,
  getLegendLabelStyle,
  getLegendTitleStyle,
  getValueLabelStyle,
  labelStylingDefinition,
} from "../styling-utils";

describe("Label styling definition", () => {
  it("should get correct label styling definition refs", () => {
    const path = "example.path";
    const chartId = "mekkochart";
    const mockFontResolver = {
      getOptions: () => {
        ["font1", "font2", "font3"];
      },
      getDefaultValue: () => {
        "defaultValue";
      },
    };
    const mockTheme = {
      getStyle: () => {
        "green";
      },
    };
    const definition = labelStylingDefinition(path, mockFontResolver, chartId, mockTheme);

    expect(definition.fontFamilyItem.ref).toEqual("example.path.fontFamily");
    expect(definition.fontWrapperItem.items.fontSizeItem.ref).toEqual("example.path.fontSize");
    expect(definition.fontWrapperItem.items.fontColorItem.ref).toEqual("example.path.fontColor");
  });
});

describe("Styling options", () => {
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

  it("should get corrext getAxisLabelStyle", () => {
    const component = {
      key: "axis",
      axis: {
        label: {
          name: {
            fontFamily: "aLabelFont, sans-serif",
            fontSize: "2000",
            fontColor: { color: "green" },
          },
        },
      },
    };
    layout.components = [component];
    const style = getAxisLabelStyle(theme, layout);
    expect(style.fontFamily).toEqual("aLabelFont, sans-serif");
    expect(style.fontSize).toEqual("2000");
    expect(style.fill).toEqual("green");
  });

  it("should get corrext getValueLabelStyle", () => {
    const component = {
      key: "value",
      label: {
        value: {
          fontFamily: "vLabelFont, sans-serif",
          fontSize: "3000",
          fontColor: { color: "blue" },
        },
      },
    };
    layout.components = [component];
    const style = getValueLabelStyle(theme, layout);
    expect(style.fontFamily).toEqual("vLabelFont, sans-serif");
    expect(style.fontSize).toEqual(3000);
    expect(style.fill).toEqual("blue");
  });

  it("should get corrext getLegendTitleStyle", () => {
    const component = {
      key: "legend",
      legend: {
        title: {
          fontFamily: "lTitleFont, sans-serif",
          fontSize: "4000",
          fontColor: { color: "purple" },
        },
      },
    };
    layout.components = [component];
    const style = getLegendTitleStyle(theme, layout, flags);
    expect(style.fontFamily).toEqual("lTitleFont, sans-serif");
    expect(style.fontSize).toEqual("4000");
    expect(style.color).toEqual("purple");
  });

  it("should get corrext getLegendLabelStyle", () => {
    const component = {
      key: "legend",
      legend: {
        label: {
          fontFamily: "lLabelFont, sans-serif",
          fontSize: "5000",
          fontColor: { color: "yellow" },
        },
      },
    };
    layout.components = [component];
    const style = getLegendLabelStyle(theme, layout, flags);
    expect(style.fontFamily).toEqual("lLabelFont, sans-serif");
    expect(style.fontSize).toEqual("5000");
    expect(style.color).toEqual("yellow");
  });
});
