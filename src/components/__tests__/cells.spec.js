import cells from '../cells';

describe('cells', () => {
  const param = {
    constraints: {
      passive: true,
      active: true,
    },
    hc: {
      qDimensionInfo: [{}, {}],
    },
  };

  it('should contain empty brush config when passive and active constraints', () => {
    const c = cells(param);
    expect(c[0].brush).to.eql({});
  });

  it('should not have any brush trigger when dimension is locked', () => {
    const c = cells({
      ...param,
      constraints: {},
      hc: { qDimensionInfo: [{}, { qLocked: true }] },
    });
    expect(c[0].brush.trigger).to.eql([]);
  });
});
