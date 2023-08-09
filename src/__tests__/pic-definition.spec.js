import * as axis from "../components/axis";
import * as cells from "../components/cells";
import * as columns from "../components/columns";
import * as disclaimer from "../components/disclaimer";
import * as tooltip from "../components/tooltip";
import picDefinition from "../pic-definition";
import * as scales from "../scales";

const mock = ({
  mockAxis = [],
  mockCells = [],
  mockColumns = [],
  mockTooltip = ["nope"],
  mockDisclaimer = [],
  mockScales = {},
} = {}) => {
  jest.spyOn(axis, "default").mockReturnValue(mockAxis);
  jest.spyOn(cells, "default").mockReturnValue(mockCells);
  jest.spyOn(columns, "default").mockReturnValue(mockColumns);
  jest.spyOn(tooltip, "default").mockReturnValue(mockTooltip);
  jest.spyOn(disclaimer, "default").mockReturnValue(mockDisclaimer);
  jest.spyOn(scales, "default").mockReturnValue(mockScales);
};

describe("pic-definition", () => {
  const constraints = { passive: true, active: true, select: true };
  const picassoColoring = {
    color: () => "fill",
    datumProps: () => ({ colorProp: "c" }),
    scales: () => ({ colorScale: "s" }),
    palettes: () => ["p"],
    legend: () => ({ components: [], interactions: [] }),
    settings: () => ({}),
  };
  const env = {};
  const param = {
    constraints,
    picassoColoring,
    env,
    layout: {},
    flags: {
      isEnabled: () => true,
    },
    theme: {
      getStyle: () => {},
    },
  };
  describe("components", () => {
    it("should contain axis", () => {
      mock({
        mockAxis: ["x", "y"],
      });
      const c = picDefinition(param).components;
      expect(c).toEqual(["x", "y"]);
    });

    it("should contain cell rects and labels", () => {
      mock({
        mockCells: ["rects", "labels"],
      });
      const c = picDefinition(param).components;
      expect(c).toEqual(["rects", "labels"]);
    });

    it("should contain span rects and labels", () => {
      mock({
        mockAxis: ["sr", "slabels"],
      });
      const c = picDefinition(param).components;
      expect(c).toEqual(["sr", "slabels"]);
    });

    it("should contain tooltip when no passive constraint", () => {
      mock({
        mockTooltip: ["t"],
      });
      const c = picDefinition({
        ...param,
        constraints: {},
      }).components;
      expect(c).toEqual(["t"]);
    });

    it("should only contain disclaimer component when disruptive restrictions apply", () => {
      mock({
        mockDisclaimer: ["d"],
        mockCells: ["c"],
      });
      const c = picDefinition({
        constraints,
        restricted: { type: "disrupt" },
        picassoColoring,
        env,
      });
      expect(c).toEqual({
        components: ["d"],
      });
    });

    it("should contain disclaimer component when restrictions apply", () => {
      mock({
        mockDisclaimer: ["d"],
      });
      const c = picDefinition({
        ...param,
        restricted: {},
      }).components;
      expect(c).toEqual(["d"]);
    });

    it("should contain legend component", () => {
      mock();
      const c = picDefinition({
        ...param,
        restricted: {},
        picassoColoring: {
          ...picassoColoring,
          legend: () => ({ components: ["leg"], interactions: [] }),
        },
      }).components;
      expect(c).toEqual(["leg"]);
    });
  });

  it("should contain scales", () => {
    mock({
      mockScales: { x: "data" },
    });
    const s = picDefinition(param).scales;
    expect(s).toEqual({ x: "data", colorScale: "s" });
  });

  it("should contain palettes", () => {
    mock();
    const s = picDefinition(param).palettes;
    expect(s).toEqual(["p"]);
  });

  describe("collections", () => {
    it("should contain stacked first dimension", () => {
      mock({});
      const [
        {
          key,
          data: {
            extract: { field, reduce, trackBy },
            stack: { stackKey },
          },
        },
      ] = picDefinition(param).collections;
      expect(key).toEqual("span");
      expect(field).toEqual("qDimensionInfo/0");
      expect(reduce).toEqual("first");
      const cell = { qElemNumber: 7 };

      expect(trackBy(cell)).toEqual(7);
      expect(stackKey()).toEqual(-1);
    });

    it("should contain a second dimension", () => {
      mock({});
      const [
        ,
        {
          key,
          data: {
            extract: { field, props },
          },
        },
      ] = picDefinition(param).collections;
      expect(key).toEqual("cells");
      expect(field).toEqual("qDimensionInfo/1");
      expect(props.colorProp).toEqual("c");
    });
  });

  it("should not contain any events when active and passive constraints", () => {
    mock();
    const s = picDefinition(param).interactions;
    expect(s).toEqual([]);
  });

  it("should contain interactive mousemove and mouseleave when no passive constraints", () => {
    mock();
    const s = picDefinition({
      ...param,
      constraints: {},
    }).interactions;
    expect(Object.keys(s[0].events)).toEqual(["mousemove", "mouseleave"]);
  });

  it("should contain legend interactions", () => {
    mock();
    const c = picDefinition({
      constraints: { passive: true },
      restricted: {},
      picassoColoring: {
        ...picassoColoring,
        legend: () => ({ components: [], interactions: ["legint"] }),
      },
      env,
      layout: {},
      flags: {
        isEnabled: () => true,
      },
      theme: {
        getStyle: () => {},
      },
    }).interactions;
    expect(c).toEqual(["legint"]);
  });
});
