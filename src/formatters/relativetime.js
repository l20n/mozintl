import { BaseFormat} from './base';
import { deconstructPattern } from '../utils';

export function computeTimeUnits(v) {
  /*eslint no-magic-numbers: [0]*/
  const units = {};
  const millisecond = Math.round(v);
  const second = Math.round(millisecond / 1000);
  const minute = Math.round(second / 60);
  const hour = Math.round(minute / 60);
  const day = Math.round(hour / 24);
  const rawYear = day * 400 / 146097;
  units.millisecond = millisecond;
  units.second = second;
  units.minute = minute;
  units.hour = hour;
  units.day = day;
  units.week = Math.round(day / 7);
  units.month = Math.round(rawYear * 12);
  units.quarter = Math.round(rawYear * 4);
  units.year = Math.round(rawYear);
  return units;
}

export function getBestMatchUnit(units) {
  /*eslint brace-style: [0]*/
  //if (Math.abs(units.second) < 45) { return 'second'; }
  if (Math.abs(units.minute) < 45) { return 'minute'; }
  if (Math.abs(units.hour) < 22) { return 'hour'; }
  // Intl uses 26 days here
  if (Math.abs(units.day) < 7) { return 'day'; }
  if (Math.abs(units.week) < 4) { return 'week'; }
  if (Math.abs(units.month) < 11) { return 'month'; }
  //if (Math.abs(units.quarter) < 4) { return 'quarter'; }
  return 'year';
}

export function relativeTimeFormatId(x, unit, style) {
  const ms = x - Date.now();

  const units = computeTimeUnits(ms);

  if (unit === 'bestFit') {
    unit = getBestMatchUnit(units);
  }

  const v = units[unit];

  // CLDR uses past || future
  const tl = v < 0 ? '-ago' : '-until';

  const entry = unit + 's' + tl + '-' + style;

  return {
    patternId: entry,
    value: Math.abs(v)
  };
}

function FormatToParts(unit, style, x) {
  const {patternId, value} = relativeTimeFormatId(x, unit, style);
  return document.l10n.formatValue(patternId, {
    value
  }).then(pattern => {
    return deconstructPattern(pattern, {
      value: {type: 'number', value}
    });
  });
}

export class RelativeTimeFormat extends BaseFormat {
  constructor(locales, options) {
    super(locales, options, {
      style: 'long',
      unit: 'bestFit'
    });
  }

  format(x) {
    const unit = this['[[Unit]]'];
    const style = this['[[Style]]'];
    return FormatToParts(unit, style, x).then(parts => {
      return parts.reduce((string, part) => string + part.value, '');
    });
  }

  formatToParts(x) {
    const unit = this['[[Unit]]'];
    const style = this['[[Style]]'];
    return FormatToParts(unit, style, x);
  }
}
