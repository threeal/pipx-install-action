# Pipx Install Action

Install [Python](https://www.python.org/) packages using [pipx](https://pipx.pypa.io/stable/) with [cache support](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows) on [GitHub Actions](https://github.com/features/actions).

Use this action to install Python packages using pipx, especially for tools written in Python that should be installed in isolated environments.
After installation, this action will automatically save the installed packages to a cache to speed up installations for subsequent workflow runs.

## Key Features

- Installs Python packages using pipx.
- Caches Python package installations to be used in subsequent workflow runs.

## Available Inputs

| Name       | Type                        | Description                                   |
| ---------- | --------------------------- | --------------------------------------------- |
| `packages` | Multiple strings (required) | Names of the Python packages to be installed. |

## Example Usages

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
        uses: actions/checkout@v4.1.2

      - name: Install Ruff
        uses: threeal/pipx-install-action@v1.0.0
        with:
          packages: ruff

      # Add more steps as needed for the workflow
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024 [Alfi Maulana](https://github.com/threeal/)
