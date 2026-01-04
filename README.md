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
  uses: threeal/pipx-install-action@v2.0.0
  with:
    packages: a-package another-package
```

### Available Inputs

| Name       | Type             | Description                                   |
| ---------- | ---------------- | --------------------------------------------- |
| `packages` | Multiple strings | Names of the Python packages to be installed. |

### Example Usage

This example demonstrates how to use the Pipx Install Action to install [Ruff](https://pypi.org/project/ruff/) in a GitHub Actions workflow:

```yaml
name: Python CI
on:
  push:
jobs:
  build:
    name: Build
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.2

      - name: Install Ruff
        uses: threeal/pipx-install-action@v2.0.0
        with:
          packages: ruff

      # Add more steps as needed for the workflow
```

## Using the JavaScript Library

Install the JavaScript library using a package manager:

```bash
npm install pipx-install-action
```

The library provides several functions for installing and caching Python packages within GitHub Actions. Refer to the [documentation](https://threeal.github.io/pipx-install-action/) for more information about the functions available in this action and their usage.

## Example Usage

This example demonstrates how to use this library to install and cache [Ruff](https://pypi.org/project/ruff/) in a JavaScript action:

```js
import {
  installPipxPackage,
  restorePipxPackageCache,
  savePipxPackageCache,
} from "pipx-install-action";

const restored = await restorePipxPackageCache("ruff");
if (!restored) {
  await installPipxPackage("ruff");
  await savePipxPackageCache("ruff");
}
```

The code above first attempts to restore the Ruff package cache. If the cache is unavailable, it installs the package and saves it to the cache for future workflow runs.

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024-2026 [Alfi Maulana](https://github.com/threeal/)
