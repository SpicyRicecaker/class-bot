# Autozoom

## Info
- Auto-open links for classes at the right time, provided browser+info

## Usage
1. Install [Deno](https://deno.land/#installation)
2. Edit `start.bat`, replace stuff in quotes with path with path to your desired browser
  - e.g.
    ```bash
    deno run --allow-read --allow-run main.ts "C:\Program Files\Mozilla Firefox\firefox.exe"
    ```
  - to 
    ```bash
    deno run --allow-read --allow-run main.ts "C:\Program Files\Google\Chrome\Application\chrome.exe"
    ```
3. Change your `links.json` accordingly
4. Run `start.bat`

## Observations
- Not as versatile as node version, where we can have puppeteer auto-fill forms
- MUCH easier to setup and faster than the node version