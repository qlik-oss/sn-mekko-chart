function action(e, { chart, key }) {
  const coord = e.type === 'touchend' ? e.changedTouches[0] : e;
  const p = {
    x: coord.clientX,
    y: coord.clientY,
  };

  const comps = chart.componentsFromPoint(p).some((c) => c.key === `${key}-cat`);

  if (!comps || !e.target) {
    return;
  }

  const { target } = e;

  if (target.hasAttribute('data-action') && target.hasAttribute('data-component-key')) {
    // clicked on one of the buttons
    e.preventDefault();
    chart.component(target.getAttribute('data-component-key')).emit(target.getAttribute('data-action'));
    return;
  }

  if (target.childNodes[0] && target.childNodes[0].nodeName === 'BUTTON') {
    // assume clicked on navigation area
    e.preventDefault();
  }
}

export default function tap({
  key, // component key
}) {
  return {
    key: `event:tap-${key}`,
    type: 'native',
    events: {
      click(e) {
        action(e, { chart: this.chart, key });
      },
      touchend(e) {
        action(e, { chart: this.chart, key });
      },
    },
  };
}
