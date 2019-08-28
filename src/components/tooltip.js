const TOOLTIP_CONTAINER_SELECTOR = 'nebulajs-sn-mekko-tooltip';

function appendTooltipContainer() {
  if (!document.querySelector(`#${TOOLTIP_CONTAINER_SELECTOR}`)) {
    const container = document.createElement('div');
    container.id = TOOLTIP_CONTAINER_SELECTOR;
    container.style.overflow = 'hidden';
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.left = '0px';
    container.style.top = '0px';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = 1020;
    document.body.appendChild(container);
  }
}

function destroyTooltipContainer() {
  const elm = document.querySelector(`#${TOOLTIP_CONTAINER_SELECTOR}`);
  if (elm && elm.parentElement && elm.childElementCount < 1) {
    elm.parentElement.removeChild(elm);
  }
}

const nodeTooltipContent = ({ h, data }) => {
  const rows = [];
  data.forEach((node) => {
    const title = h('th', {
      attrs: { colspan: 3 },
      style: { fontWeight: 600, 'text-align': 'left', padding: '2px 4px' },
    }, node.title);

    rows.push(title);

    node.props.forEach((prop) => {
      const cells = [
        h('td', { style: { padding: '2px 4px' } }, `${prop.label}:`),
        h('td', { style: { margin: '2px 4px' } }, [
          h('span', {
            style: {
              'background-color': prop.color || 'transparent',
              display: 'inline-block',
              width: '0.75em',
              height: '0.75em',
            },
          }),
        ]),
        h('td', { style: { 'text-align': 'right', padding: '2px 4px' } }, prop.value),
      ];
      rows.push(h('tr', {}, cells));
    });
  });

  return h('div', { style: { display: 'table' } }, rows);
};

export default function () {
  return [{
    type: 'tooltip',
    key: 'tool',
    layout: {
      displayOrder: 99,
    },
    beforeMount() {
      appendTooltipContainer();
    },
    beforeUpdate() {
      // appendTooltipContainer();
    },
    destroyed() {
      destroyTooltipContainer();
    },
    settings: {
      appendTo: () => document.querySelector(`#${TOOLTIP_CONTAINER_SELECTOR}`),
      filter: nodes => nodes.filter(n => n.key === 'cells' || n.key === 'column-boxes'),
      extract: ({ node, resources }) => {
        const share = `${((node.data.end.value - node.data.start.value) * 100).toFixed(2)}%`;
        if (node.key === 'column-boxes') {
          // column label tooltip
          return {
            contentFn: nodeTooltipContent,
            title: node.data.label,
            props: [{
              label: resources.dataset().field('qMeasureInfo/0').title(),
              value: node.data.metric.label,
            }],
          };
        }

        // cell tooltip
        return {
          contentFn: nodeTooltipContent,
          title: `${node.data.series.label}, ${node.data.label}`,
          props: [{
            label: resources.dataset().field('qMeasureInfo/0').title(),
            value: share,
          }],
        };
      },
      content: nodeTooltipContent,
    },
  }];
}
