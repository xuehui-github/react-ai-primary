# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

See [AGENTS.md](AGENTS.md) for build/lint/dev commands, coding style, and project structure. This file covers architecture that requires reading multiple files to understand.

## Architecture

This is a **FICC investment advisory business management system** (FICC投资顾问业务管理系统) — a single-page React app with no routing library. The entire UI lives in [src/App.jsx](src/App.jsx) with styles in [src/App.css](src/App.css).

### Vite Proxy

The dev server proxies all `/v1` requests to `http://localhost:9089` ([vite.config.js](vite.config.js#L8-L12)). Two API endpoints are consumed:

| Endpoint | Method | Used By |
|---|---|---|
| `/v1/prodAssetValu/queryList` | POST | `专户` tab |
| `/v1/prodAssetValuOfIn/queryList` | POST | `账户` tab |

Both accept `{ pageNum, pageSize, ...optionalFilters }`. Responses follow `{ records, pageNum, pageSize, total, pages }`.

### Dual Data-Source Pattern

Each tab resolves data differently:

- **`专户`** and **`账户`** tabs — fetch from the API. State is managed via `useEffect` that fires on tab switch, with `fetchSpecialAccountRows` / `fetchAccountRows` callbacks.
- **`第二估值`** and all menu-driven sub-tabs (e.g., `持仓明细(估值表)`, `申赎情况录入`) — read from the local `dataSets` object, which serves as both mock data and fallback when APIs are absent. Filters apply client-side against this static data.

The `rows` memo ([src/App.jsx:257-263](src/App.jsx#L257-L263)) switches between these sources based on `activeTab`.

### Menu → Tab → Data Mapping

`menuGroups` defines the sidebar. Items with `children` (currently only `风险管理`) expand into sub-items. Clicking a sub-item sets `activeMenu` and reads `dataSets[childLabel]` for display.

The `账户信息(估值表)` menu item is special — it has its own sub-tabs (`专户`, `账户`, `第二估值`) rendered in the tab strip. Only the first two tabs hit the API; `第二估值` uses local data.

### Column Resize

Table column widths are stored in `columnWidths` state. Resizing uses raw `pointermove`/`pointerup` event listeners on `window` ([src/App.jsx:295-317](src/App.jsx#L295-L317)), tracked via `resizingColumn` state. Each `<th>` has a `.column-resizer` button that initiates the drag on `onPointerDown`.

### ESLint Config

Uses ESLint flat config via `eslint/config`'s `defineConfig` helper ([eslint.config.js](eslint.config.js)). Ignores `dist/`. Applies `@eslint/js` recommended, `eslint-plugin-react-hooks` strict, and `eslint-plugin-react-refresh` rules to all `.js`/`.jsx` files. Browser globals are enabled; JSX parsing is enabled via `ecmaFeatures: { jsx: true }`.

### Assets

- `src/assets/` — bundled assets imported via JavaScript (`hero.png`, `ficc.png`, SVG logos)
- `public/` — root-served files with stable URLs (`favicon.svg`, `icons.svg`)
