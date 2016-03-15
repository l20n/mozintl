import { ListFormat } from './listformat';
import { PluralRules } from './pluralrules';
import { getCanonicalLocales } from './locale';
import { DurationFormat } from './durationformat';


window.mozIntl = {
  ListFormat,
  PluralRules,
  DurationFormat,
  getCanonicalLocales
};
