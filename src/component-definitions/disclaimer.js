function calculateState(c, settings) {
  const struct = {
    type: 'text',
    text: settings.text,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    anchor: 'left',
    baseline: 'alphabetical',
    ...c.style.text,
  };

  const textRect = c.renderer.measureText(struct);
  const preferredSize = /px$/.test(c.style.text.lineHeight) ? parseInt(c.style.text.lineHeight, 10) : textRect.height;

  return {
    textRect,
    struct,
    preferredSize,
  };
}

const component = {
  require: ['renderer', 'chart'],
  defaultSettings: {
    layout: {
      dock: 'bottom',
      displayOrder: 0,
      prioOrder: 0,
    },
    settings: {},
    style: {
      text: '$title',
    },
  },

  created() {
    this.state = calculateState(this, this.settings.settings);
  },

  beforeUpdate(opts) {
    this.state = calculateState(this, opts.settings.settings);
  },

  preferredSize() {
    return this.state.preferredSize;
  },

  render() {
    const {
      rect,
      state,
    } = this;

    const { dock } = this.settings;

    const struct = { ...state.struct };
    struct.dy = -state.textRect.height / 6;

    const padTop = (state.preferredSize - state.textRect.height) / 2;

    struct.y = padTop + rect.height / 2 + state.textRect.height / 3;
    struct.maxWidth = rect.width;

    if (dock === 'center') {
      struct.anchor = 'middle';
      struct.x = rect.width / 2;
    }

    const nodes = [
      struct,
    ];
    return nodes;
  },
};

export default function plugin(picasso) {
  picasso.component('disclaimer', component);
}
