"use babel";

function getPanes() {
  const allPanes = atom.workspace.getPanes(),
    panesFilter = (prop, name) =>
      allPanes.filter(
        (x) =>
          x[prop] && x[prop].constructor && x[prop].constructor.name === name
      );
  let panes = panesFilter("parent", "PaneAxis");
  if (!panes.length) panes = panesFilter("activeItem", "TextEditor");
  return panes;
}

function getOrientationPanes(horizontal) {
  const panes = getPanes(),
    orientation = horizontal ? "horizontal" : "vertical";
  return panes.filter(
    (x) => (x.parent.orientation || orientation) === orientation
  );
}

async function addUntilNPanes(n, horizontal) {
  let panes = getOrientationPanes(horizontal),
    paneCount = panes.length;

  // If no oriented panes, use the active pane to split from
  if (paneCount === 0) {
    const activePane = atom.workspace.getActivePane();
    if (activePane) {
      if (horizontal) activePane.splitRight({ copyActiveItem: false });
      else activePane.splitDown({ copyActiveItem: false });
      panes = getOrientationPanes(horizontal);
      paneCount = panes.length;
    }
    if (paneCount === 0) return;
  } else {
    if (horizontal) panes.slice(-1)[0].splitRight({ copyActiveItem: false });
    else panes.slice(-1)[0].splitDown({ copyActiveItem: false });
  }

  if (paneCount + 1 < n) {
    try {
      await addUntilNPanes(n, horizontal);
    } catch (err) {
      return;
    }
  }
  return;
}

function mergeTwoPanes(lastPane, secondToLastPane) {
  const lastPaneItems = lastPane.getItems();
  for (const item of Array.from(lastPaneItems)) {
    lastPane.moveItemToPane(item, secondToLastPane);
  }
  lastPane.destroy();
}

function mergeUntilNPanes(n, horizontal) {
  const result = [];
  let panes = getOrientationPanes(horizontal);
  while (panes.length > n) {
    mergeTwoPanes(panes.slice(-1)[0], panes.slice(-2)[0]);
    result.push((panes = getOrientationPanes(horizontal)));
  }
  return;
}

async function ensurePanes(n, horizontal) {
  const revPaneCount = getOrientationPanes(!horizontal).length;
  let paneCount = getOrientationPanes(horizontal).length;
  if (
    (revPaneCount > 0 && paneCount > 1) ||
    (revPaneCount > 1 && paneCount > 0) ||
    (!horizontal && paneCount >= 4 && paneCount % 2 === 0)
  ) {
    let panes = getPanes();
    while (panes.length > 1) {
      mergeTwoPanes(panes.slice(-1)[0], panes.slice(-2)[0]);
      panes = getPanes();
    }
  } else if (revPaneCount > 1) {
    mergeUntilNPanes(1, !horizontal);
  }
  paneCount = getOrientationPanes(horizontal).length;
  if (paneCount < n && n > 1) await addUntilNPanes(n, horizontal);
  else if (paneCount > n) mergeUntilNPanes(n, horizontal);
  return;
}

function ensureGrid() {
  ensurePanes(2, true)
    .then(() => {
      const panes = getPanes();
      Array.from(panes).map((item) => item.splitDown());
    })
    .catch((err) => {});
}

export default { ensurePanes, ensureGrid };
