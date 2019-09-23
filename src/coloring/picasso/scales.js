export function persistByElemNo(field, num) {
  return {
    range: ({ resources, data }) => {
      const palette = resources.theme.palette('categorical', num);
      return data.items.map(v => palette[v.value % palette.length]);
    },
    valueAccessor: field.value,
  };
}

export function persistByRow(field, num) {
  return {
    range: ({ resources, data }) => {
      const palette = resources.theme.palette('categorical', num);
      return data.items.map(v => palette[v.row.value % palette.length]);
    },
    valueAccessor: field.value,
  };
}

export function getPersistenceSettings({
  coloring,
  hc,
  picasso,
  localeInfo,
}) {
  const shouldPersistByElemNo = coloring.persistent;

  const pic = picasso.data('q')({ data: hc, config: { localeInfo } });

  const f = pic.field(coloring.field);

  if (!f) {
    return {};
  }

  if (shouldPersistByElemNo) {
    return persistByElemNo(f, f.raw().qCardinal);
  }
  const num = pic.extract({
    field: f.key(),
    trackBy: f.value,
  }).length;
  return persistByRow(f, num);
}

export function byDimensionData({
  hc,
  source,
  coloring,
  persistence,
}) {
  const ret = {
    data: {
      extract: [{
        // this dummy is only here in order to reset the expando when tracking row numbers during paging
        source: 'dummy',
        field: 0,
        // this filter method will be called from picasso when datasets are extract
        filter: () => {
          ret.expando = hc.qDataPages[0] ? hc.qDataPages[0].qArea.qTop : 0;
          return false;
        },
      }, {
        source,
        field: coloring.field,
        trackBy: persistence.valueAccessor,
        reduce: 'first',
        props: {
          row: {
            reduce: () => ret.expando++,
          },
          text: { value: v => v.qText, reduce: 'first' },
        },
      }],
    },
    expando: 0,
  };

  return ret;
}

/**
 * @private
 * @param {object} p
 * @param {QAE.HyperCube} p.hc
 * @param {object} p.coloring
 * @param {boolean} p.rtl
 * @param {string} [p.key] identifier
 * @param {string} [p.source] Alternative source to apply on the scale. Defaults to the first entry in the picasso data array if not specified
 */
export default function colorScales({
  hc,
  coloring,
  key,
  source,
  picasso,
} = {}) {
  const scales = {};
  const scaleKey = key;
  if (coloring) {
    const explicit = {
      override: true,
      domain: coloring.explicit && typeof coloring.explicit.domain === 'function' ? coloring.explicit.domain
        : [...((coloring.explicit || {}).domain || []), -3, -2],
      range: coloring.explicit && typeof coloring.explicit.range === 'function' ? coloring.explicit.range
        : [...((coloring.explicit || {}).range || []), coloring.others, coloring.nil],
    };
    if (coloring.mode === 'field') {
      if (coloring.fieldType === 'dimension') {
        const persistence = getPersistenceSettings({
          hc,
          coloring,
          picasso,
        });
        const { data } = byDimensionData({
          hc, source, coloring, persistence,
        });

        const s = {
          data,
          range: persistence.range || coloring.range,
          domain: coloring.domain,
          explicit,
          type: 'categorical-color',
          label: d => (d.datum.text && d.datum.text.value ? d.datum.text.value : d.datum.label),
        };

        scales[scaleKey] = s;
      } else {
        throw new Error('UNUSED FIELD'); // FIXME
      }
    }
  }

  return scales;
}
