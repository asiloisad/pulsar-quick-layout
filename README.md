# quick-layout

Quick access to predefined pane layouts and dock toggles.

![demo](https://github.com/asiloisad/pulsar-quick-layout/blob/master/assets/buttons.png?raw=true)

## Features

- Title bar buttons for quick layout switching (requires [title-bar](https://web.pulsar-edit.dev/packages/title-bar) package)
- Buttons are visible on hover (it can customized in styles.less)
- Dock toggle buttons (left, bottom, right)
- Layout buttons (1 pane, 2 columns, 3 columns, 2x2 grid)
- All actions available as commands

## Installation

To install `quick-layout` search for [quick-layout](https://web.pulsar-edit.dev/packages/quick-layout) in the Install pane of the Pulsar settings or run `ppm install quick-layout`. Alternatively, you can run `ppm install asiloisad/pulsar-quick-layout` to install a package directly from the GitHub repository.

## Commands

### Dock Toggles

| Command | Description |
|---------|-------------|
| `quick-layout:toggle-left-dock` | Toggle left dock visibility |
| `quick-layout:toggle-bottom-dock` | Toggle bottom dock visibility |
| `quick-layout:toggle-right-dock` | Toggle right dock visibility |

### Layout Commands

| Command | Description |
|---------|-------------|
| `quick-layout:one-pane` | Single pane layout |
| `quick-layout:two-columns` | Two columns side by side |
| `quick-layout:three-columns` | Three columns side by side |
| `quick-layout:four-columns` | Four columns side by side |
| `quick-layout:two-rows` | Two rows stacked |
| `quick-layout:three-rows` | Three rows stacked |
| `quick-layout:grid` | 2x2 grid layout |

# Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback’s welcome!
