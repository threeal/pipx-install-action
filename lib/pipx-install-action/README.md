# pipx-install-action

Install [Python](https://www.python.org/) packages using [pipx](https://pipx.pypa.io/stable/) on your [GitHub Actions](https://github.com/features/actions).

This JavaScript library provides a `pipxInstallAction` function similar to the [Pipx Install Action](https://github.com/threeal/pipx-install-action) for installing Python packages within GitHub Actions.
Use this library to execute the Pipx Install Action in JavaScript, particularly when creating a [JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action) that requires steps for installing Python packages.

## Key Features

- Installs Python packages using pipx.
- Caches Python package installations to be used in subsequent workflow runs.

## Examples

This example demonstrates how to use the `pipxInstallAction` function to install the [Ruff](https://pypi.org/project/ruff/) package in a JavaScript action.

```js
import { pipxInstallAction } from "pipx-install-action";

pipxInstallAction("ruff");
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2024 [Alfi Maulana](https://github.com/threeal/)
