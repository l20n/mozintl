import { BaseFormat} from './base';
import { deconstructPattern } from '../utils';

export function ComputeTimeUnits(v) {
  /*eslint no-magic-numbers: [0]*/
  const DaysPerWeek = 7;
  const HoursPerDay = 24;
  const MinutesPerHour = 60;
  const SecondsPerMinute = 60;
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * SecondsPerMinute;
  const msPerHour = msPerMinute * MinutesPerHour;
  const msPerDay = msPerHour * HoursPerDay;
  const msPerWeek = msPerDay * DaysPerWeek;
  const msPer400Years = msPerDay * 146097;

  const units = {};
  const rawYear = v * 400 / msPer400Years;

  units['[[Second]]'] = Math.round(v / msPerSecond);
  units['[[Minute]]'] = Math.round(v / msPerMinute);
  units['[[Hour]]'] = Math.round(v / msPerHour);
  units['[[Day]]'] = Math.round(v / msPerDay);
  units['[[Week]]'] = Math.round(v / msPerWeek);
  units['[[Month]]'] = Math.round(rawYear * 12);
  units['[[Quarter]]'] = Math.round(rawYear * 4);
  units['[[Year]]'] = Math.round(rawYear);
  return units;
}

export function GetBestMatchUnit(units) {
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

export function RelativeTimeFormatId(x, unit, style) {
  const ms = x - Date.now();

  const units = ComputeTimeUnits(ms);

  if (unit === 'bestFit') {
    unit = GetBestMatchUnit(units);
  }

  let unitKey = unit[0].toUpperCase() + unit.slice(1);

  const v = units[`[[${unitKey}]]`];

  // CLDR uses past || future
  const tl = v < 0 ? '-ago' : '-until';

  const entry = unit + 's' + tl + '-' + style;

  return {
    patternId: entry,
    value: Math.abs(v)
  };
}

function FormatToParts(unit, style, x) {
  const {patternId, value} = RelativeTimeFormatId(x, unit, style);
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
