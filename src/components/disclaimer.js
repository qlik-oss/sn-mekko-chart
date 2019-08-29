export default function disclaimer(config) {
  if (!config) {
    return [];
  }
  // TODO - use translator
  if (config.type === 'disrupt') {
    return [{
      key: 'disclaimer',
      type: 'disclaimer',
      dock: 'center',
      settings: {
        text: config.label,
      },
    }];
  }

  return [{
    key: 'disclaimer',
    type: 'disclaimer',
    dock: 'bottom',
    style: {
      text: {
        '@extend': '$label',
        fontSize: '12px',
        lineHeight: '16px',
        fontStyle: 'italic',
      },
    },
    settings: {
      text: `* ${config.label}`,
      anchor: 'left',
    },
  }];
}
