# quick-layout

Quick access to predefined pane layouts and dock toggles. Add buttons to the title bar for fast layout switching.

![demo](https://github.com/asiloisad/pulsar-quick-layout/blob/master/assets/buttons.png?raw=true)

Fork of [layout-control](https://github.com/rafamel/atom-layout-control).

## Features

- **Title bar buttons**: Quick layout switching (requires [title-bar](https://web.pulsar-edit.dev/packages/title-bar)).
- **Dock toggles**: Left, bottom, and right dock visibility.
- **Layout presets**: 1-4 columns, 1-3 rows, and 2x2 grid.
- **Hover reveal**: Buttons appear on title bar hover.

## Installation

To install `quick-layout` search for [quick-layout](https://web.pulsar-edit.dev/packages/quick-layout) in the Install pane of the Pulsar settings or run `ppm install quick-layout`. Alternatively, you can run `ppm install asiloisad/pulsar-quick-layout` to install a package directly from the GitHub repository.

## Commands

Commands available in `atom-workspace`:

- `quick-layout:toggle-left-dock`: toggle left dock visibility,
- `quick-layout:toggle-bottom-dock`: toggle bottom dock visibility,
- `quick-layout:toggle-right-dock`: toggle right dock visibility,
- `quick-layout:one-pane`: single pane layout,
- `quick-layout:two-columns`: two columns side by side,
- `quick-layout:three-columns`: three columns side by side,
- `quick-layout:four-columns`: four columns side by side,
- `quick-layout:two-rows`: two rows stacked,
- `quick-layout:three-rows`: three rows stacked,
- `quick-layout:grid-two`: 2x2 grid layout,
- `quick-layout:grid-three`: 3x3 grid layout,
- `quick-layout:redistribute`: equally redistribute all center items across existing panes,
- `quick-layout:sequentize`: assign 1 item per pane, overflow goes to the first pane.

Right-click a layout button to automatically redistribute items after the layout change. Middle-click to sequentize instead.

When switching to a layout with fewer panes, the active item from the previously active pane stays focused.

## Customization

The style can be adjusted according to user preferences in the `styles.less` file:

- e.g. make buttons visible all the time instead of only on hover:
  ```less
  .quick-layout {
    opacity: 1;
    pointer-events: auto;
  }
  ```

- e.g. hide a specific button by id (e.g. `#quick-layout-one-pane`, `#quick-layout-grid-2x2`):
  ```less
  #quick-layout-one-pane {
    display: none;
  }
  ```

- e.g. hide dock toggle buttons but keep layout buttons (or vice versa):
  ```less
  .quick-layout-toggles {
    display: none;
  }
  ```
  ```less
  .quick-layout-layouts {
    display: none;
  }
  ```

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback's welcome!
