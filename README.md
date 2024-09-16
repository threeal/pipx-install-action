# Pipx Install Action

Install [Python](https://www.python.org/) packages using [pipx](https://pipx.pypa.io/stable/) with [cache support](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows) on [GitHub Actions](https://github.com/features/actions).

Use this project to install Python packages with pipx, especially for tools written in Python that should be installed in isolated environments.
After installation, it automatically saves the installed packages to a cache, speeding up installations for subsequent workflow runs.

This project includes two components: a GitHub Action that can be used directly in workflows, and a [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) library that provides functions for use in a [JavaScript Action](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-javascript-action).

## Key Features

- Installs Python packages using pipx.
- Caches Python package installations for reuse in subsequent workflow runs.

## Using the GitHub Action

Use the following snippet to include the action in a GitHub workflow:

```yaml
- name: Install Packages
  uses: threeal/pipx-install-action@v1.0.0
  with:
    packages: a-package another-package
```

### Available Inputs

| Name       | Type             | Description                                   |
| ---------- | ---------------- | --------------------------------------------- |
| `packages` | Multiple strings | Names of the Python packages to be installed. |

### Example Usages

This example demonstrates how to use the Pipx Install Action to install [Ruff](https://pypi.org/project/ruff/) in a GitHub Actions workflow:

```yaml
name: Python CI
on:
  push:
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.7

      - name: Install Ruff
        uses: threeal/pipx-install-action@v1.0.0
        with:
          packages: ruff

      # Add more steps as needed for the workflow
```

## Using the JavaScript Library

Install the JavaScript library using a package manager:

```bash
npm install pipx-install-action
```

The library provides a `pipxInstallAction` function for installing Python packages within GitHub Actions.

## Example Usages

This example demonstrates how to use the `pipxInstallAction` function to install [Ruff](https://pypi.org/project/ruff/) in a JavaScript action:

```js
import { pipxInstallAction } from "pipx-install-action";

pipxInstallAction("ruff");
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024 [Alfi Maulana](https://github.com/threeal/)
