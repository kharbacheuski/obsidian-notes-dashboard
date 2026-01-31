# Notes Dashboard for Obsidian

A beautiful Kanban-style dashboard plugin for Obsidian that allows you to organize and display your favorite notes as cards in customizable columns.

## Description

Notes Dashboard transforms any note into an interactive Kanban board where you can organize your notes into columns. Each card represents a note in your vault, and you can easily add, remove, and organize them visually.

## Features

- **Kanban Board Layout** - Organize notes in customizable columns
- **Easy Card Management** - Add and remove cards with a single click
- **Multiple Sorting Options** - Sort cards by name, modification date, or creation date
- **Tag Display** - See tags associated with each note card
- **Internationalization** - Supports English and Russian (with easy extension for more languages)
- **Beautiful UI** - Modern, responsive design that matches Obsidian's theme
- **Fast Performance** - Optimized file handling and rendering

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Go to Community Plugins
3. Search for "Notes Dashboard"
4. Click Install, then Enable

### Manual Installation

1. Download the latest release from GitHub
2. Extract the files to your vault's `.obsidian/plugins/notes-dashboard/` folder
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## Usage

### Creating a Dashboard

1. Create a new note in Obsidian
2. Add the following YAML frontmatter:

```yaml
---
dashboard: true
layout: kanban
sort: modified
columns:
  - name: To Do
    pages:
      - My Note 1
      - My Note 2
  - name: In Progress
    pages:
      - My Note 3
  - name: Done
    pages:
      - My Note 4
cssclasses: props-hidden
---
```

3. Open the note - the dashboard will render automatically!

### Adding Columns

- Click the "+" button at the bottom of the board
- Type the column name and press Enter

### Adding Notes

- Click the "+" button in a column header
- Search for and select a note from your vault
- The note will be added as a card to that column

### Removing Notes

- Click the "×" button on any card to remove it from the dashboard

### Removing Columns

- Click the trash icon in the column header

### Opening Notes

- Click on any card to open the corresponding note

## Configuration Options

### Frontmatter Parameters

- `dashboard: true` - Required to enable dashboard rendering
- `layout: kanban` - Sets the layout type (currently only "kanban" is supported)
- `sort` - Card sorting method:
  - `modified` - Sort by last modification date (default)
  - `created` - Sort by creation date
  - `name` - Sort alphabetically by file name
- `columns` - Array of column definitions:
  - `name` - Column name (required)
  - `pages` - Array of note basenames (without extension) to display as cards

### CSS Classes

- `props-hidden` - Hides the properties section in Obsidian's UI

## Examples

### Simple Dashboard

```yaml
---
dashboard: true
layout: kanban
columns:
  - name: Favorites
    pages:
      - Daily Note
      - Project Ideas
      - Meeting Notes
---
```

### Dashboard with Sorting

```yaml
---
dashboard: true
layout: kanban
sort: name
columns:
  - name: Recent
    pages:
      - Note 1
      - Note 2
---
```

## Troubleshooting

**Dashboard not rendering?**
- Make sure `dashboard: true` is in the frontmatter
- Check that the note names in `pages` match the actual file names (without extension)
- Try reloading Obsidian

**Notes not appearing?**
- Verify that the note names in the `pages` array match the exact basenames of files in your vault
- Check that the files exist and are accessible

**Styling issues?**
- The plugin uses Obsidian's CSS variables, so it should adapt to your theme automatically
- If you have custom CSS, make sure it doesn't conflict with `.kanban-*` classes

## Development

### Building from Source

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have feature requests, please open an issue on GitHub.

---

Made with ❤️ for the Obsidian community