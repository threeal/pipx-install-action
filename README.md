# Pipx Install Action

[![version](https://img.shields.io/github/v/release/threeal/pipx-install-action?style=flat-square)](https://github.com/threeal/pipx-install-action/releases)
[![license](https://img.shields.io/github/license/threeal/pipx-install-action?style=flat-square)](./LICENSE)
[![build status](https://img.shields.io/github/actions/workflow/status/threeal/pipx-install-action/build.yaml?branch=main&label=build&style=flat-square)](https://github.com/threeal/pipx-install-action/actions/workflows/build.yaml)
[![test status](https://img.shields.io/github/actions/workflow/status/threeal/pipx-install-action/test.yaml?branch=main&label=test&style=flat-square)](https://github.com/threeal/pipx-install-action/actions/workflows/test.yaml)

The Pipx Install Action is a [GitHub Action](https://github.com/features/actions) designed to install [Python](https://www.python.org/) packages using [pipx](https://pipx.pypa.io/stable/) with cache support.

## Key Features

The Pipx Install Action provides the following key features:

- Install Python packages using pipx.

## Usage

To begin using the Pipx Install Action, refer to the [action.yaml](./action.yaml) file for detailed configuration options.
If you are new to GitHub Actions, you can explore the [GitHub Actions guide](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) for a comprehensive overview.

### Inputs

Here are the available input parameters for the Pipx Install Action:

| Name       | Type                       | Description                                   |
| ---------- | -------------------------- | --------------------------------------------- |
| `packages` | Multiple string (required) | Names of the Python packages to be installed. |

### Examples

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
        uses: actions/checkout@v4.1.1

      - name: Install Ruff
        uses: threeal/pipx-install-action@main
        with:
          packages: ruff

      # Add more steps as needed for your workflow
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024 [Alfi Maulana](https://github.com/threeal/)
