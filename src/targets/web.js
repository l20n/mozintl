import { ListFormat } from '../formatters/list';
import { PluralRules } from '../formatters/plural';
import { getCanonicalLocales, getCalendarInfo } from '../locale';
import { DurationFormat } from '../formatters/duration';
import { RelativeTimeFormat } from '../formatters/relativetime';
import { UnitFormat } from '../formatters/unit';


window.mozIntl = {
  ListFormat,
  PluralRules,
  DurationFormat,
  RelativeTimeFormat,
  UnitFormat,
  getCanonicalLocales,
  getCalendarInfo,
};
