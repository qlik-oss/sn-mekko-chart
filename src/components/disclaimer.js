export default function disclaimer(config, translator) {
  if (!config) {
    return [];
  }
  const t = translator.get(config.translation);
  if (config.type === 'disrupt') {
    return [
      {
        key: 'disclaimer',
        type: 'disclaimer',
        dock: 'center',
        settings: {
          text: t !== config.translation ? t : config.label,
        },
      },
    ];
  }

  return [
    {
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
        text: `* ${t !== config.translation ? t : config.label}`,
        anchor: 'left',
      },
    },
  ];
}
