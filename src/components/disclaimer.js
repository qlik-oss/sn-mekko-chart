import { RESTRICTIONS } from '../data-restrictions';

function getTranslatedValue(restriction, translator) {
  switch (restriction) {
    case RESTRICTIONS.HasNoData:
      return translator.get('Disclaimer.NoDataExist');
    case RESTRICTIONS.HasOnlyNaNValues:
      return translator.get('Disclaimer.OnlyNaNData');
    case RESTRICTIONS.HasOnlyNegativeOrZeroValues:
      return translator.get('Disclaimer.OnlyNegativeOrZeroValues');
    case RESTRICTIONS.HasLimitedDataset:
      return translator.get('Disclaimer.LimitedData');
    case RESTRICTIONS.HasZeroOrNegativeValues:
      return translator.get('Disclaimer.NegativeOrZeroValues');
    default:
      return '';
  }
}

export default function disclaimer(config, translator) {
  if (!config) {
    return [];
  }
  const t = getTranslatedValue(config, translator);
  if (config.type === 'disrupt') {
    return [
      {
        key: 'disclaimer',
        type: 'disclaimer',
        dock: 'center',
        settings: {
          text: t || config.label,
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
