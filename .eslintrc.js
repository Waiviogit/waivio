const OFF = 0;
const ERROR = 2;

module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  rules: {
    'camelcase': OFF,
    'react/jsx-filename-extension': [ERROR, { extensions: ['.js'] }],
    'no-duplicate-imports': 2,
    'react/jsx-key': 2,
    'import/no-extraneous-dependencies': [
      ERROR,
      {
        devDependencies: [
          '**/__tests__/*.js',
          'scripts/**/*.js',
          'webpack/**/*.js',
        ],
      },
    ],
    "react/require-default-props": "off",
    'no-unused-vars': ERROR,
    'no-use-before-define': OFF,
    'no-case-declarations': OFF,
    'no-console': [ERROR, { allow: ["warn", "error"] }],
    'global-require': OFF,
    // Allow mixed linebreaks locally, but commit only LF.
    'linebreak-style': process.env.CI ? ['error', 'unix'] : OFF,
    "react/sort-comp": [2, {
      order: [
        'static-variables',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }],
    "padding-line-between-statements": [2,
      { "blankLine": "always", "prev": ["const", "let", "var"], "next": "*"},
      { "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"]},
      { "blankLine": "always", "prev": "*", "next": "return" }
    ],
    "sort-imports": [ERROR, {
      "ignoreCase": false,
      "ignoreDeclarationSort": true,
      "ignoreMemberSort": true,
      "allowSeparatedGroups": true,
      "memberSyntaxSortOrder": ["single", "multiple", "all", "none"]
    }],
    "no-underscore-dangle": OFF,
    "no-plusplus": OFF,
    "no-unused-expressions": OFF,
    "jsx-a11y/no-noninteractive-element-interactions": OFF,
    "jsx-a11y/no-static-element-interactions": OFF,
    "jsx-a11y/anchor-has-content": [OFF, {
      "components": [ "Anchor" ],
    }],
    "jsx-a11y/heading-has-content": [ OFF, {
      "components": [ "MyHeading" ],
    }],
  },
};
