# PUG Template Project

This project provides a simple setup example that converts PUG files to HTML with file tracker using PUG templates and copies public assets to an output directory. The project also includes the ability to periodically clean and rebuild the output directory.

## Features

- Converts PUG templates to HTML.
- Copies public assets (CSS, JS, images, etc.) to the output directory.
- Monitors changes in the source directory and updates the output directory accordingly.
- Periodically cleans and rebuilds the output directory.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Eren-Seyfi/vanilla-PUG-generate.git
   cd PUG-template-project
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the project:

   ```bash
   npm start
   ```

## Structure

- **src**: Resource directory containing PUG templates and public assets.
  - **templates**: Contains `layouts`, `partials`, `components` and `pages`.
  - **public**: Contains public assets such as CSS and JS files.
- **www**: Output directory where converted HTML and copied assets are stored.
- **bootstrap.js**: The main script for setting up the project, tracking changes and converting templates.
- **structure.json**: Configuration file that defines the structure and settings.

## How Layouts Work:

In this project, PUG templates are divided into layouts to provide a modular structure. Layout files are located in the templates/layouts directory. Each page PUG file indicates which layout file it belongs to by specifying the layout name in the file name, for example, index.main.PUG indicates that the main.PUG layout will be used.

When templates are rendered, the layout file is used to wrap the page content. This ensures consistent header, footer and navigation sections between different pages. For example, an index.main.PUG file will be wrapped with the main.PUG layout and the same header and footer will be used for all pages using this layout.

## Configuration

### structure.json

```json
{
  "inputDir": "src",
  "outputDir": "www",
  "interval": 5000,
  "mainTemplate": "templates/layouts/main.PUG",
  "pagesDir": "templates/pages",
  "templates": {
    "layouts": ["main.PUG", "example.PUG"],
    "partials": ["header.PUG", "footer.PUG", "nav.PUG"],
    "pages": [
      "index.main.PUG",
      "about.main.PUG",
      "index.example.PUG",
      "about.example.PUG"
    ],
    "components": []
  },
  "public": {
    "css": ["style.css"],
    "js": ["app.js"]
  }
}
```

- **inputDir**: Source directory
- **outputDir**: Output directory.
- **interval**: Interval in milliseconds to clear and rebuild the output directory.
- **mainTemplate**: Path to the main PUG template.
- **pagesDir**: Directory containing PUG page templates.
- **templates**: The structure of the templates.
- **public**: Structure of public entities.

## Scripts

- **start**: Runs the main script (`bootstrap.js`).

Translated with DeepL.com (free version)
