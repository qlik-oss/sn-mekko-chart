const RXA = /\/(qDimensions|qMeasures)\/(\d+)\/(qAttributeDimensions|qAttributeExpressions)\/(\d+)/;

export function findFields(needle, hc) {
  const found = [];
  const targets = hc.qDimensions
    ? [['qDimensions', 'qMeasures'], ['qAttributeDimensions', 'qAttributeExpressions']]
    : [['qDimensionInfo', 'qMeasureInfo'], ['qAttrDimInfo', 'qAttrExprInfo']];

  targets[0].forEach((f) => {
    const arr = hc[f] || [];
    for (let i = 0; i < arr.length; i++) {
      if (needle(typeof arr[i].qDef === 'object' ? arr[i].qDef : arr[i])) {
        found.push({ path: `/${f}/${i}`, definition: arr[i] });
      }
      targets[1].forEach((af) => {
        const attrArr = arr[i][af] || [];
        for (let j = 0; j < attrArr.length; j++) {
          if (needle(typeof attrArr[j].qDef === 'object' ? attrArr[j].qDef : attrArr[j])) {
            found.push({ path: `/${f}/${i}/${af}/${j}`, definition: attrArr[j] });
          }
        }
      });
    }
  });

  return found;
}

export function addRole(definition, role) {
  const d = typeof definition.qDef === 'object' ? definition.qDef : definition;
  if (!d.roles) {
    d.roles = [];
  }
  const has = d.roles.filter(r => r.role === role).length > 0;
  if (!has) {
    d.roles.push({ role });
  }
}

export function removeRoleFrom(definition, role) {
  const d = typeof definition.qDef === 'object' ? definition.qDef : definition;
  if (!d.roles) {
    return;
  }
  for (let i = 0; i < d.roles.length; i++) {
    if (d.roles[i].role === role) {
      d.roles.splice(i, 1);
      return;
    }
  }
}

export function removeRole(hc, role) {
  const existing = findFields(f => f.roles && f.roles.filter(r => r.role === role).length > 0, hc);

  existing.sort().reverse().forEach((f) => { // remove from back of array first to ensure proper slicing
    const m = RXA.exec(f.path);
    if (m) {
      hc[m[1]][+m[2]][m[3]].splice(+m[4], 1); // TODO - decide whether to remove role only instead of attribute
    } else {
      // remove role only
      removeRoleFrom(f.definition, role);
    }
  });
}
