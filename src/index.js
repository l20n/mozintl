import { ListFormat } from './listformat';
import { PluralRules } from './pluralrules';
import { getCanonicalLocales, getCalendarInfo } from './locale';
import { DurationFormat } from './durationformat';
import { RelativeTimeFormat } from './relativetimeformat';
import { UnitFormat } from './unitformat';
import { gaia } from './gaia';


window.mozIntl = {
  ListFormat,
  PluralRules,
  DurationFormat,
  RelativeTimeFormat,
  UnitFormat,
  getCanonicalLocales,
  getCalendarInfo,
  _gaia: gaia
};
