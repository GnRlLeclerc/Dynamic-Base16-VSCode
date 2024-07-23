# 🎨 Dynamic Base16 VSCode theme

A simple VSCode extension to dynamically change VSCode's theme based on a json theme file or a json base16 colors file.
Made to work in tandem with [Flavours](https://github.com/Misterio77/flavours).

Inspired from [dlasagno/vscode-wal-theme](https://github.com/dlasagno/vscode-wal-theme).

Made for Linux be default, but should work on other platforms by tweaking the paths settings.

## Features

This extension can watch and dynamically reload either a json theme file or a json base16 colors file.

### Settings

- `dynamic-base16-vscode.mode`: The mode to use. Can be either `theme` or `colors`, defaults to `theme`.
- `dynamic-base16-vscode.theme-path`: The path to the theme json file to watch. Defaults to `~/.config/Code/User/theme.json`.
- `dynamic-base16-vscode.colors-path`: The path to the colors json file to watch. Defaults to `~/.config/Code/User/colors.json`.

## Flavours configuration

The following [Flavours](https://github.com/Misterio77/flavours) configurations can be used together with this extension for dynamic theme reloads.

### Colors

Be sure to put the [`colors.mustache`](./assets/colors.mustache) file in your Flavours configuration folder (`~/.config/flavours/templates/colors/templates/json.mustache`).

```toml
[[items]]
file = "~/.config/Code/User/colors.json"
template = "colors"
subtemplates = "json"
rewrite = true
```

### Theme

```toml
[[items]]
file = "~/.config/Code/User/theme.json"
template = "vscode"
subtemplate = "base16"
rewrite = true
```
