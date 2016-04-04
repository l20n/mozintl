import { ListFormat } from '../formatters/list';
import { PluralRules } from '../formatters/plural';
import { getCanonicalLocales } from '../locale';
import { DurationFormat } from '../formatters/duration';
import { RelativeTimeFormat } from '../formatters/relativetime';
import { UnitFormat } from '../formatters/unit';


window.Intl = Object.assign(window.Intl, {
  ListFormat,
  PluralRules,
  DurationFormat,
  RelativeTimeFormat,
  UnitFormat,
  getCanonicalLocales,
});
