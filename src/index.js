import { ListFormat } from './listformat';
import { PluralRules } from './pluralrules';
import { getCanonicalLocales } from './locale';
import { DurationFormat } from './durationformat';
import { RelativeTimeFormat } from './relativetimeformat';
import { UnitFormat } from './unitformat';


window.mozIntl = {
  ListFormat,
  PluralRules,
  DurationFormat,
  RelativeTimeFormat,
  UnitFormat,
  getCanonicalLocales
};
