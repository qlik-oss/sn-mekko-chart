const mock = ({
  axis = () => [],
  cells = () => [],
  columns = () => [],
  tooltip = () => ['nope'],
  disclaimer = () => [],
  scales = () => ({}),
  stack = () => ({}),
} = {}) =>
  aw.mock(
    [
      ['**/components/axis.js', () => axis],
      ['**/components/cells.js', () => cells],
      ['**/components/columns.js', () => columns],
      ['**/components/tooltip.js', () => tooltip],
      ['**/components/disclaimer.js', () => disclaimer],
      ['**/scales.js', () => scales],
      ['**/stack.js', () => stack],
    ],
    ['../pic-definition']
  );

describe('pic-definition', () => {
  const constraints = { passive: true, active: true, select: true };
  const picassoColoring = {
    color: () => 'fill',
    datumProps: () => ({ colorProp: 'c' }),
    scales: () => ({ colorScale: 's' }),
    palettes: () => ['p'],
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
  };
  describe('components', () => {
    it('should contain axis', () => {
      const [{ default: def }] = mock({
        axis: () => ['x', 'y'],
      });
      const c = def(param).components;
      expect(c).to.eql(['x', 'y']);
    });

    it('should contain cell rects and labels', () => {
      const [{ default: def }] = mock({
        cells: () => ['rects', 'labels'],
      });
      const c = def(param).components;
      expect(c).to.eql(['rects', 'labels']);
    });

    it('should contain span rects and labels', () => {
      const [{ default: def }] = mock({
        axis: () => ['sr', 'slabels'],
      });
      const c = def(param).components;
      expect(c).to.eql(['sr', 'slabels']);
    });

    it('should contain tooltip when no passive constraint', () => {
      const [{ default: def }] = mock({
        tooltip: () => ['t'],
      });
      const c = def({
        ...param,
        constraints: {},
      }).components;
      expect(c).to.eql(['t']);
    });

    it('should only contain disclaimer component when disruptive restrictions apply', () => {
      const [{ default: def }] = mock({
        disclaimer: () => ['d'],
        cells: () => ['c'],
      });
      const c = def({
        constraints,
        restricted: { type: 'disrupt' },
        picassoColoring,
        env,
      });
      expect(c).to.eql({
        components: ['d'],
      });
    });

    it('should contain disclaimer component when restrictions apply', () => {
      const [{ default: def }] = mock({
        disclaimer: () => ['d'],
      });
      const c = def({
        ...param,
        restricted: {},
      }).components;
      expect(c).to.eql(['d']);
    });

    it('should contain legend component', () => {
      const [{ default: def }] = mock();
      const c = def({
        ...param,
        restricted: {},
        picassoColoring: {
          ...picassoColoring,
          legend: () => ({ components: ['leg'], interactions: [] }),
        },
      }).components;
      expect(c).to.eql(['leg']);
    });
  });

  it('should contain scales', () => {
    const [{ default: def }] = mock({
      scales: () => ({ x: 'data' }),
    });
    const s = def(param).scales;
    expect(s).to.eql({ x: 'data', colorScale: 's' });
  });

  it('should contain palettes', () => {
    const [{ default: def }] = mock();
    const s = def(param).palettes;
    expect(s).to.eql(['p']);
  });

  describe('collections', () => {
    it('should contain stacked first dimension', () => {
      const [{ default: def }] = mock({
        stack: (opts) => opts,
      });
      const [first] = def(param).collections;
      expect(first).to.containSubset({
        key: 'span',
        field: 'qDimensionInfo/0',
        reduce: 'first',
      });
      const cell = { qElemNumber: 7 };

      expect(first.trackBy(cell)).to.equal(7);
      expect(first.stackKey()).to.equal(-1);
    });

    it('should contain a second dimension', () => {
      const [{ default: def }] = mock({
        stack: (opts) => opts,
      });
      const [, second] = def(param).collections;
      expect(second).to.eql({
        key: 'cells',
        field: 'qDimensionInfo/1',
        props: {
          colorProp: 'c',
        },
      });
    });
  });

  it('should not contain any events when active and passive constraints', () => {
    const [{ default: def }] = mock();
    const s = def(param).interactions;
    expect(s).to.eql([]);
  });

  it('should contain interactive mousemove and mouseleave when no passive constraints', () => {
    const [{ default: def }] = mock();
    const s = def({
      ...param,
      constraints: {},
    }).interactions;
    expect(Object.keys(s[0].events)).to.eql(['mousemove', 'mouseleave']);
  });

  it('should contain legend interactions', () => {
    const [{ default: def }] = mock();
    const c = def({
      constraints: { passive: true },
      restricted: {},
      picassoColoring: {
        ...picassoColoring,
        legend: () => ({ components: [], interactions: ['legint'] }),
      },
      env,
      layout: {},
      flags: {
        isEnabled: () => true,
      },
    }).interactions;
    expect(c).to.eql(['legint']);
  });
});
