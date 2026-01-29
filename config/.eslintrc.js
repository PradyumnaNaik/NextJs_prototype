module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/strict',
  ],
  plugins: ['@typescript-eslint', 'jsx-a11y', 'security'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: '../tsconfig.json',
  },
  rules: {
    // ═══════════════════════════════════════════════════════════════
    // TYPESCRIPT STRICT RULES
    // ═══════════════════════════════════════════════════════════════
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',

    // ═══════════════════════════════════════════════════════════════
    // ACCESSIBILITY (WCAG 2.1 AA)
    // ═══════════════════════════════════════════════════════════════
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',

    // ═══════════════════════════════════════════════════════════════
    // SECURITY
    // ═══════════════════════════════════════════════════════════════
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'react/no-danger': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // ═══════════════════════════════════════════════════════════════
    // REACT / NEXT.JS
    // ═══════════════════════════════════════════════════════════════
    'react/jsx-no-target-blank': 'error',
    'react/jsx-key': 'error',

    // ═══════════════════════════════════════════════════════════════
    // IMPORT ORGANIZATION
    // ═══════════════════════════════════════════════════════════════
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  overrides: [
    {
      // Relax rules for test files
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },
  ],
};
