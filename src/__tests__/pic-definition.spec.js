const mock = ({
  axis = () => [],
  cells = () => [],
  spanLabels = () => [],
  tooltip = () => ['nope'],
  scales = () => ({}),
  stack = () => ({}),
} = {}) => aw.mock([
  ['**/components/axis.js', () => axis],
  ['**/components/cells.js', () => cells],
  ['**/components/span-labels.js', () => spanLabels],
  ['**/components/tooltip.js', () => tooltip],
  ['**/scales.js', () => scales],
  ['**/stack.js', () => stack],
], ['../pic-definition']);

describe('pic-definition', () => {
  const context = {
    permissions: [],
  };
  describe('components', () => {
    it('should contain axis', () => {
      const [{ default: def }] = mock({
        axis: () => ['x', 'y'],
      });
      const c = def({ context }).components;
      expect(c).to.eql(['x', 'y']);
    });

    it('should contain cell rects and labels', () => {
      const [{ default: def }] = mock({
        cells: () => ['rects', 'labels'],
      });
      const c = def({ context }).components;
      expect(c).to.eql(['rects', 'labels']);
    });

    it('should contain span rects and labels', () => {
      const [{ default: def }] = mock({
        axis: () => ['sr', 'slabels'],
      });
      const c = def({ context }).components;
      expect(c).to.eql(['sr', 'slabels']);
    });

    it('should contain tooltip when permission is passive', () => {
      const [{ default: def }] = mock({
        tooltip: () => ['t'],
      });
      const c = def({ context: { permissions: ['passive'] } }).components;
      expect(c).to.eql(['t']);
    });
  });

  it('should contain scales', () => {
    const [{ default: def }] = mock({
      scales: () => ({ x: 'data' }),
    });
    const s = def({ context }).scales;
    expect(s).to.eql({ x: 'data' });
  });

  describe('collections', () => {
    it('should contain stacked first dimension', () => {
      const [{ default: def }] = mock({
        stack: opts => opts,
      });
      const [first] = def({ context }).collections;
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
        stack: opts => opts,
      });
      const [, second] = def({ context }).collections;
      expect(second).to.eql({
        key: 'stacked',
        field: 'qDimensionInfo/1',
      });
    });
  });

  it('should not contain any events when passive permission is missing', () => {
    const [{ default: def }] = mock();
    const s = def({ context }).interactions;
    expect(Object.keys(s[0].events)).to.eql([]);
  });

  it('should contain interactive mousemove and mouseleave when passive', () => {
    const [{ default: def }] = mock();
    const s = def({ context: { permissions: ['passive'] } }).interactions;
    expect(Object.keys(s[0].events)).to.eql(['mousemove', 'mouseleave']);
  });
});
