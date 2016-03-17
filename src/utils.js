export function deconstructPattern(pattern, placeables) {
  const parts = pattern.split(/\{([^\}]+)\}/);
  const result = [];

  parts.forEach((part, i) => {
    if (i % 2 === 0) {
      if (part.length > 0) {
        result.push({type: 'literal', value: part});
      }
    } else {
      const subst = placeables[part];
      if (!subst) {
        throw new Error(`Missing placeable: "${part}"`);
      }
      if (Array.isArray(subst)) {
        result.push(...subst);
      } else {
        result.push(subst);
      }
    }
  });
  return result;
}
