# PR Screenshots Workflow

This GitHub Actions workflow automatically captures screenshots of the PsychCombo website on every pull request. This helps reviewers visually spot UI issues, regressions, or improvements.

## What it does

When a PR is opened or updated that affects the website or shared packages, the workflow:

1. **Builds the website** - Runs the full build process including image generation
2. **Starts a local server** - Serves the built static files
3. **Takes screenshots** - Captures screenshots of key pages at different viewports
4. **Uploads artifacts** - Makes screenshots available for download
5. **Comments on PR** - Adds a comment listing all captured screenshots

## Pages captured

### Desktop (1280x720)
- Homepage (`/`)
- Psychoactives list (`/psychoactives`)
- Psychoactive detail page (`/psychoactives/alcohol`)
- Combo detail page (`/combos/alcohol-benzodiazepines`)
- Privacy policy (`/privacy-policy`)

### Mobile (390x844)
- Homepage (`/`)
- Psychoactives list (`/psychoactives`)

## How to view screenshots

1. Go to the **Actions** tab of the PR
2. Click on the **PR Screenshots** workflow run
3. Download the **pr-screenshots** artifact
4. Extract and review the PNG files

Alternatively, check the PR comment which lists all captured screenshots.

## When it runs

The workflow only runs when:
- A pull request targets the `main` branch
- Changes are made to files in `packages/website/**` or `packages/shared/**`

## Technical details

- **Browser**: Chromium via Playwright
- **Screenshot tool**: Playwright CLI
- **Server**: Python's built-in HTTP server (since Cloudflare adapter doesn't support preview)
- **Retention**: Screenshots are kept for 30 days

## Troubleshooting

If the workflow fails:

1. **Build failure**: Check if `npm run build --workspace website` works locally
2. **Missing pages**: Verify the URLs exist in the built site
3. **Screenshot errors**: Check Playwright installation and browser compatibility

## Future improvements

Possible enhancements:
- Visual regression testing (compare screenshots between PRs)
- More pages and viewports
- Tablet viewport (768px)
- Landscape mobile (844x390)
- Accessibility testing alongside screenshots
