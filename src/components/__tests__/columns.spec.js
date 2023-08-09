import columns from "../columns";

describe("columns", () => {
  const param = {
    constraints: { active: true, select: true },
    hc: {
      qDimensionInfo: [{}, {}],
    },
  };

  it("should contain empty brush config when neither select nor active is allowed", () => {
    const c = columns(param);
    expect(c[0].brush).toEqual({});
  });

  it("should not have any brush trigger when dimension is locked", () => {
    const c = columns({
      ...param,
      constraints: {},
      hc: { qDimensionInfo: [{ qLocked: true }] },
    });
    expect(c[0].brush.trigger).toEqual([]);
  });

  it("should have styles from valueLabelStyle", () => {
    const c = columns({
      ...param,
      constraints: {},
      hc: { qDimensionInfo: [{ qLocked: true }] },
      valueLabelStyle: {
        fontFamily: "MyFontFamily",
      },
    });
    expect(c[1].settings.sources[0].strategy.settings.fontFamily).toEqual("MyFontFamily");
  });
});
