import axis from "../axis";

describe("axis", () => {
  const axisLabelStyle = {
    fontSize: "12px",
    fontFamily: "MyFontFamily",
    fill: "black",
  };

  it("should not have valueLabelStyle on when layout does not have components", () => {
    const a = axis({});
    const yAxis = a.find((x) => x.key === "y-axis");
    expect(yAxis.settings.labels).toEqual({});
    const xAxis = a.find((x) => x.key === "x-axis");
    expect(xAxis.settings.labels).toEqual({});
  });

  it("should have valueLabelStyle on y-axis", () => {
    const a = axis(axisLabelStyle);
    const yAxis = a.find((x) => x.key === "y-axis");
    expect(yAxis.settings.labels.fontFamily).toEqual("MyFontFamily");
    expect(yAxis.settings.labels.fontSize).toEqual("12px");
    expect(yAxis.settings.labels.fill).toEqual("black");
  });

  it("should have valueLabelStyle on x-axis", () => {
    const a = axis(axisLabelStyle);
    const xAxis = a.find((x) => x.key === "x-axis");
    expect(xAxis.settings.labels.fontFamily).toEqual("MyFontFamily");
    expect(xAxis.settings.labels.fontSize).toEqual("12px");
    expect(xAxis.settings.labels.fill).toEqual("black");
  });
});
