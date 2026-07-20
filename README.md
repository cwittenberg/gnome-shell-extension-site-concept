# Conceptual design
For Gnome Extension Store, which is due for a visual update (https://extensions.gnome.org/ aka EGO)

To run, use:
```CODE
python3 -m http.server 8000
```
Improvements:
- Categorization: Just like Snapcraft, extensions should be grouped in categories (e.g., Window Management, Customization, System Monitor) for easier discovery.
- Multiple screenshots per Extension: Today only limited to one, the new design supports a full media carousel with captions.
- Dark Mode: A much requested built-in Light/Dark theme toggle.
- Filtering & Sorting: Users can quickly filter the grid by specific GNOME Shell versions (e.g., GNOME 45 through 50) and sort by Popularity, Downloads, Name, or Relevance without reloading the page.
- Markdown Rendering: Extension descriptions support Markdown, enabling developers to use headers, lists, and code blocks for clearer documentation.
- Minimal footprint. No single image was used, just a WOFF2 optimized font library, designed using public domain icons and fontglyph.com. See here: https://github.com/cwittenberg/gnome-woff2-icon-font 
