# Development Environments

## IDE

We recommend the use of (Visual Studio Code)[https://code.visualstudio.com/] for developing the UI - it has a series of plugins for automatic linting/formatting and testing code. You should open the `ui` directory as the project root.

The `ui/.vscode.example` directory contains a `launch.json` with entries for `jest`, and `settings.json` with workspace settings to format code on save. Copy the contents into a `ui/.vscode` directory to enable the features.

### VSCode Plugins

We recommend the following plugins for Visual Studio Code to enforce code styling while developing - this avoids having to wait until commit time for the automated checks to verify the structure.

- (eslint)[https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint]
- (Prettier)[https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode]
