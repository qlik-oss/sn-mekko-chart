const mock = ({
  axis = () => [],
  cells = () => [],
  spanLabels = () => [],
  scales = () => ({}),
  stack = () => ({}),
} = {}) => aw.mock([
  ['**/components/axis.js', () => axis],
  ['**/components/cells.js', () => cells],
  ['**/components/span-labels.js', () => spanLabels],
  ['**/scales.js', () => scales],
  ['**/stack.js', () => stack],
], ['../pic-definition']);

describe('pic-definition', () => {
  describe('components', () => {
    it('should contain axis', () => {
      const [{ default: def }] = mock({
        axis: () => ['x', 'y'],
      });
      const c = def({}).components;
      expect(c).to.eql(['x', 'y']);
    });

    it('should contain cell rects and labels', () => {
      const [{ default: def }] = mock({
        cells: () => ['rects', 'labels'],
      });
      const c = def({}).components;
      expect(c).to.eql(['rects', 'labels']);
    });

    it('should contain span rects and labels', () => {
      const [{ default: def }] = mock({
        axis: () => ['sr', 'slabels'],
      });
      const c = def({}).components;
      expect(c).to.eql(['sr', 'slabels']);
    });
  });

  it('should contain scales', () => {
    const [{ default: def }] = mock({
      scales: () => ({ x: 'data' }),
    });
    const s = def({}).scales;
    expect(s).to.eql({ x: 'data' });
  });

  describe('collections', () => {
    it('should contain stacked first dimension', () => {
      const [{ default: def }] = mock({
        stack: opts => opts,
      });
      const [first] = def({}).collections;
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
      const [, second] = def({}).collections;
      expect(second).to.eql({
        key: 'stacked',
        field: 'qDimensionInfo/1',
      });
    });
  });
});
