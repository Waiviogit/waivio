import { addLocaleData } from 'react-intl';
import ruRU from 'antd/es/locale/ru_RU';
import ukUA from 'antd/es/locale/uk_UA';
import enUS from 'antd/es/locale/en_US';

// Pre-import all locale data to avoid dynamic import issues with Vite
import en from 'react-intl/locale-data/en';
import id from 'react-intl/locale-data/id';
import ms from 'react-intl/locale-data/ms';
import ca from 'react-intl/locale-data/ca';
import cs from 'react-intl/locale-data/cs';
import da from 'react-intl/locale-data/da';
import de from 'react-intl/locale-data/de';
import et from 'react-intl/locale-data/et';
import es from 'react-intl/locale-data/es';
import fil from 'react-intl/locale-data/fil';
import fr from 'react-intl/locale-data/fr';
import hr from 'react-intl/locale-data/hr';
import it from 'react-intl/locale-data/it';
import hu from 'react-intl/locale-data/hu';
import pl from 'react-intl/locale-data/pl';
import pt from 'react-intl/locale-data/pt';
import ru from 'react-intl/locale-data/ru';
import uk from 'react-intl/locale-data/uk';
import ar from 'react-intl/locale-data/ar';
import hi from 'react-intl/locale-data/hi';
import ko from 'react-intl/locale-data/ko';
import ja from 'react-intl/locale-data/ja';
import af from 'react-intl/locale-data/af';
import zh from 'react-intl/locale-data/zh';

import LANGUAGES from './languages';

// Locale data map for static imports
const localeDataMap = {
  en, id, ms, ca, cs, da, de, et, es, fil, fr, hr, it, hu, pl, pt, ru, uk, ar, hi, ko, ja, af, zh
};

// Translation imports - use Vite's glob import for JSON files
const translationModules = import.meta.glob('../locales/*.json');

export function findLanguage(locale) {
  return LANGUAGES.find(language => language.variants?.indexOf(locale) !== -1) || LANGUAGES[0];
}

export function getRequestLocale(locales) {
  if (!locales || locales === '*') return LANGUAGES[0];

  return locales.split(',').map(lang => lang.split(';')[0])[0];
}

export function getBrowserLocale() {
  if (typeof navigator !== 'undefined') {
    return (
      navigator.userLanguage ||
      navigator.language ||
      (navigator.languages && navigator.languages[0] ? navigator.languages[0] : undefined)
    );
  }

  return undefined;
}

export function getLanguageText(language) {
  if (language.name === language.nativeName) return language.name;

  return `${language.nativeName} - ${language.name}`;
}

export async function loadLanguage(locale) {
  const language = findLanguage(locale);

  // Get locale data from pre-imported map
  const localeData = localeDataMap[language.localeData];
  if (localeData) {
    addLocaleData(localeData);
  }

  // Load translations using Vite's glob import
  const translationKey = `../locales/${language.translations}`;
  const loadTranslation = translationModules[translationKey];
  
  let translations = {};
  if (loadTranslation) {
    const module = await loadTranslation();
    translations = module.default || module;
  }

  return {
    id: language.id,
    translations,
  };
}

export const getAntdLocale = language => {
  switch (language.id) {
    case 'ru-RU':
      return ruRU;
    case 'uk-UA':
      return ukUA;
    default:
      return enUS;
  }
};
