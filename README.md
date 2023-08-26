# SSL Labs Screenshot

Capture a trimmed screenshot of the SSL Labs report for a given domain.

<p align="center"><img src="https://raw.githubusercontent.com/marksowell/ssl-labs-screenshot-js/main/images/www.ssllabs.com_report.png" width="300px" />

## Requirements

- Node.js (version 14 or higher)
- A modern operating system capable of running Puppeteer (Windows, macOS, or Linux)

## Installation

Install the package globally to use it as a command-line tool:

```bash
npm install -g ssl-labs-screenshot
```

Or, install it locally for use in your project:

```bash
npm install ssl-labs-screenshot
```

## Usage

### Command Line

After installing the package globally, you can use the `ssl-labs-screenshot` command:

```bash
ssl-labs-screenshot example.com
```

This will generate a screenshot named `example.com_report.png` in the current directory.

### In Your Project

You can also use the `captureSSLLabsScreenshot` function in your project:

```javascript
import { captureSSLLabsScreenshot } from 'ssl-labs-screenshot';
captureSSLLabsScreenshot('example.com');
```

## Features

- Capture a detailed screenshot from SSL Labs.
- Automatic navigation to a IPv4 host if both IPv4 and IPv6 hosts are present.
- Returns the overall SSL rating grade for the domain.
- Error handling for invalid domains or issues with SSL Labs.

## Example Output

```bash
✔ Overall rating: A
✔ Screenshot saved as www.sslabs.com_report.png
```

## Issues and Feedback

For any issues, feedback, or suggestions, please [open a new issue](https://github.com/marksowell/ssl-labs-screenshot-js/issues) in the GitHub repository.

## License

The scripts and documentation in this project are released under the [MIT License](https://github.com/marksowell/ssl-labs-screenshot-js/blob/main/LICENSE)