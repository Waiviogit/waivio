# Waivio 🚀

Waivio is an Open Source social network and communications platform which extends itself to a variety of rich features and functionality including free digital payments and a marketplace for goods and services.

## Preview

![Preview](https://s3-eu-central-1.amazonaws.com/production-investarena-post/1540279829_1fca35a7-18bd-4e12-a65b-a08e997b88df)

## Quick Setup

```bash
git clone https://github.com/Waiviogit/waivio.git
cd waivio

yarn
yarn dev
```

##Project Structure

- `webpack` - webpack configuration
- `public` - statistic image and fonts
- `src/routes` - route configs
- `src/common` - constants, helpers, locales and services
- `src/hook` - custom hooks
- `src/store` - reducers, actions and selectors
- `src/client` - UI conponents

##Project tools

- `react-intl` - translation tool

##Common conversation

- Dont use class components.
- Dont use props dectructuring.
- Use lodash dectructuring.
- In your commit you need fix translations and nightmode.

##Code style

Just use prettier and adhere ESLint recomendations.

## Git conversation
You need checkout branches and create pull request _only_ for `dev`

Branch names should be prefixed with `tech/`, `feature/` or `bugfix/` followed by ticket number from Jira,
dash and a few descriptive words.  
Example: `feature/WAIV-999-order-creation`

##Commits
Before commit you need start comand:

```
yarn prettier
```

Commit messages must follow the following format:

```
[Ticket number] [message]

[Optional body]
```

The message should be capped at 75 characters and must be in indefinite tense. It should read as _'\[If accepted, this commit will\] add order creation'_.

If provided, the body might include a detailed header, long description and a list of changes with bullet points, all of which are optional (you can use `*` in Markdown).  
Please, DO NOT use `fixes`, `applied fixes` and other meaningless messages. If you apply fixes in a batch, use
`git commit --amend` to prevent creating meaningless commits.

PR titles should follow the same format as commit messages. Just so that you know, if you submit a PR with one commit only, GitHub assigns the title of the commit to the PR and saves you quite a bit of typing.

