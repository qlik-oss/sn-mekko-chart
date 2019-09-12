export default function disclaimer(config, env) {
  if (!config) {
    return [];
  }
  const t = env.translator;
  // TODO - use translator
  if (config.type === 'disrupt') {
    return [{
      key: 'disclaimer',
      type: 'disclaimer',
      dock: 'center',
      settings: {
        text: t ? t.get(config.translation) : config.label,
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
      text: `* ${t ? t.get(config.translation) : config.label}`,
      anchor: 'left',
    },
  }];
}
