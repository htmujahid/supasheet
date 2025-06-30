import { createI18nServerInstance } from './i18n.server';

type LayoutOrPageComponent<Params> = React.ComponentType<Params>;

export function withI18n<Params extends object>(
  Component: LayoutOrPageComponent<Params>,
) {
  return async function I18nServerComponentWrapper(params: Params) {
    await createI18nServerInstance();

    return <Component {...params} />;
  };
}
