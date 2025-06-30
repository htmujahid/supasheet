import { z } from 'zod';

type LanguagePriority = 'user' | 'application';

const FeatureFlagsSchema = z.object({
  enableThemeToggle: z.boolean({
    description: 'Enable theme toggle in the user interface.',
    required_error: 'Provide the variable NEXT_PUBLIC_ENABLE_THEME_TOGGLE',
  }),
  languagePriority: z
    .enum(['user', 'application'], {
      required_error: 'Provide the variable NEXT_PUBLIC_LANGUAGE_PRIORITY',
      description: `If set to user, use the user's preferred language. If set to application, use the application's default language.`,
    })
    .default('application'),
  enableVersionUpdater: z.boolean({
    description: 'Enable version updater',
    required_error: 'Provide the variable NEXT_PUBLIC_ENABLE_VERSION_UPDATER',
  }),
});

const featuresFlagConfig = FeatureFlagsSchema.parse({
  enableThemeToggle: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_THEME_TOGGLE,
    true,
  ),
  languagePriority: process.env
    .NEXT_PUBLIC_LANGUAGE_PRIORITY as LanguagePriority,
  enableVersionUpdater: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_VERSION_UPDATER,
    false,
  ),
} satisfies z.infer<typeof FeatureFlagsSchema>);

export default featuresFlagConfig;

function getBoolean(value: unknown, defaultValue: boolean) {
  if (typeof value === 'string') {
    return value === 'true';
  }

  return defaultValue;
}
