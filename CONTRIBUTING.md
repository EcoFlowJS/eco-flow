# Contributing to EcoFlowJS

We welcome contributions, but request you follow these guidelines.

- [Raising issues](#raising-issues)
- [Feature requests](#feature-requests)
- [Pull-Requests](#pull-requests)
  - [Code Branches](#code-branches)
  - [Coding Standards](#coding-standards)

This project follows the [Contributor Covenant 2](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
By participating, you are expected to uphold this code. Please report unacceptable
behavior to the project's core team at teams.ecoflow@gmail.com.

## Raising issues

Please raise any bug reports on the relevant project's issue tracker. Be sure to
search the list to see if your issue has already been raised.

If your issue is more of a question on how to do something with EcoFlowJS, please
consider using the [Discord](https://discord.gg/vNnahQ72) or [Slack](https://join.slack.com/t/newworkspace-cx01786/shared_invite/zt-2jpm9657q-dmugTuLg_udxo9jTtnwZjA).

A good bug report is one that make it easy for us to understand what you were
trying to do and what went wrong.

Provide as much context as possible so we can try to recreate the issue.
If possible, include the relevant part of your flow.

At a minimum, please include:

- Version of EcoFlowJS - either release number if you downloaded a zip, or the first few lines of `git log` if you are cloning the repository directly.
- Version of Node.js - what does `node -v` say?

## Feature requests

For feature requests, please raise them on the `request-feature` channel of [Discord](https://discord.gg/vNnahQ72).

## Pull-Requests

If you want to raise a pull-request with a new feature, or a refactoring
of existing code, please come and discuss it with us first. We prefer to
do it that way to make sure your time and effort is well spent on something
that fits with our goals.

If you've got a bug-fix or similar for us, then you are most welcome to
get it raised - just make sure you link back to the issue it's fixing and
try to include some tests!

### Code Branches

When raising a PR for a fix or a new feature, it is important to target the right branch.

- `master` - this is the main branch for the latest stable release of EcoFlowJS. All bug fixes for that release should target this branch.
- `dev` - this is the branch for new feature development targeting the next milestone release.

### Coding standards

Please ensure you follow the coding standards used through-out the existing
code base. Some basic rules include:

- indent with 2-spaces, no tabs. No arguments.
- opening brace on same line as `if`/`for`/`function` and so on, closing brace
  on its own line.
