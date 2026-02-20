# PR Screenshots Workflows

This repository has two GitHub Actions workflows that automatically capture screenshots on every pull request:
1. **Website Screenshots** (`screenshot.yml`) - Captures screenshots of the PsychCombo website
2. **Mobile App Screenshots** (`mobile-screenshots.yml`) - Captures screenshots of the Expo mobile app (web preview)

These workflows help reviewers visually spot UI issues, regressions, or improvements.

## Website Screenshots Workflow

### What it does

When a PR is opened or updated that affects the website or shared packages, the workflow:

1. **Builds the website** - Runs the full build process including image generation
2. **Starts a local server** - Serves the built static files
3. **Takes screenshots** - Captures screenshots of key pages at different viewports
4. **Uploads artifacts** - Makes screenshots available for download
5. **Comments on PR** - Adds a comment listing all captured screenshots

### Pages captured

#### Desktop (1280x720)
- Homepage (`/`)
- Psychoactives list (`/psychoactives`)
- Psychoactive detail page (`/psychoactives/alcohol`)
- Combo detail page (`/combos/alcohol-benzodiazepines`)
- Privacy policy (`/privacy-policy`)

#### Mobile (390x844)
- Homepage (`/`)
- Psychoactives list (`/psychoactives`)

### How to view screenshots

1. Go to the **Actions** tab of the PR
2. Click on the **PR Screenshots** workflow run
3. Download the **pr-screenshots** artifact
4. Extract and review the PNG files

Alternatively, check the PR comment which lists all captured screenshots.

### When it runs

The workflow only runs when:
- A pull request targets the `main` branch
- Changes are made to files in `packages/website/**` or `packages/shared/**`

### Technical details

- **Browser**: Chromium via Playwright
- **Screenshot tool**: Playwright CLI
- **Server**: Python's built-in HTTP server (since Cloudflare adapter doesn't support preview)
- **Retention**: Screenshots are kept for 30 days

### Troubleshooting

If the workflow fails:

1. **Build failure**: Check if `npm run build --workspace website` works locally
2. **Missing pages**: Verify the URLs exist in the built site
3. **Screenshot errors**: Check Playwright installation and browser compatibility

## Mobile App Screenshots Workflow

### What it does

When a PR is opened or updated that affects the mobile app or shared packages, the workflow:

1. **Exports app for web** - Uses `expo export:web` to create a web build
2. **Starts a local server** - Serves the exported web app
3. **Takes screenshots** - Captures screenshots at mobile and tablet viewports
4. **Uploads artifacts** - Makes screenshots available for download
5. **Comments on PR** - Adds a comment with details and limitations

### Screens captured

The workflow captures the initial app state at different viewports:

#### Mobile (393x852 - iPhone 14 Pro)
- Grid Tab (initial and loaded states)

#### Tablet (820x1180 - iPad)
- Grid Tab

### Limitations

Since this uses the web preview of the Expo app:
- **Tab navigation** requires E2E testing framework (not included)
- **Modal states** require user interaction simulation
- **Native features** may not work in web preview
- Only captures the initial route

### How to view screenshots

Same as website screenshots - download the `mobile-pr-screenshots` artifact from the Actions tab.

### When it runs

The workflow only runs when:
- A pull request targets the `main` branch
- Changes are made to files in `packages/mobile/**` or `packages/shared/**`

### Technical details

- **Build tool**: Expo CLI (`expo export:web`)
- **Browser**: Chromium via Playwright
- **Screenshot tool**: Playwright CLI
- **Server**: Python's built-in HTTP server
- **Retention**: Screenshots are kept for 30 days

### Future improvements

For more comprehensive mobile testing, consider:

#### Option 1: Maestro (Recommended for React Native)
- Cloud-based mobile UI testing
- Supports both iOS and Android
- Can run on real devices via Maestro Cloud
- Supports screenshots and video recording
- Easy YAML-based test definitions

#### Option 2: Detox
- E2E testing framework for React Native
- Runs on real devices and simulators
- Requires local device setup or cloud service
- More complex setup than Maestro

#### Option 3: EAS Build Previews
- Use EAS Build to create preview builds
- Manually test on real devices
- Screenshot via device or testing tools
- Requires Expo account and setup

## General Future Improvements

Possible enhancements for both workflows:
- Visual regression testing (compare screenshots between PRs)
- More pages and viewports
- Landscape orientations
- Accessibility testing alongside screenshots
- Percy, Chromatic, or similar visual testing services
