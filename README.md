# Pipx Install Action

[![version](https://img.shields.io/github/v/release/threeal/pipx-install-action?style=flat-square)](https://github.com/threeal/pipx-install-action/releases)
[![license](https://img.shields.io/github/license/threeal/pipx-install-action?style=flat-square)](./LICENSE)
[![build status](https://img.shields.io/github/actions/workflow/status/threeal/pipx-install-action/build.yaml?branch=main&label=build&style=flat-square)](https://github.com/threeal/pipx-install-action/actions/workflows/build.yaml)
[![test status](https://img.shields.io/github/actions/workflow/status/threeal/pipx-install-action/test.yaml?branch=main&label=test&style=flat-square)](https://github.com/threeal/pipx-install-action/actions/workflows/test.yaml)

Install [Python](https://www.python.org/) packages using [pipx](https://pipx.pypa.io/stable/) with [cache support](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows) on [GitHub Actions](https://github.com/features/actions).

Use this action to install Python packages using pipx, especially for tools written in Python that should be installed in isolated environments.
After installation, this action will automatically save the installed packages to a cache to speed up installations for subsequent workflow runs.

## Key Features

- Installs Python packages using pipx.
- Caches Python package installations to be used in subsequent workflow runs.

## Available Inputs

Here are the available input parameters for the Pipx Install Action:

| Name       | Type                       | Description                                   |
| ---------- | -------------------------- | --------------------------------------------- |
| `packages` | Multiple string (required) | Names of the Python packages to be installed. |

## Example Usages

Here is a basic example of how to use the Pipx Install Action to install [Ruff](https://docs.astral.sh/ruff/) in a GitHub Actions workflow:

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
        uses: actions/checkout@v4.1.2

      - name: Install Ruff
        uses: threeal/pipx-install-action@main
        with:
          packages: ruff

      # Add more steps as needed for your workflow
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024 [Alfi Maulana](https://github.com/threeal/)
