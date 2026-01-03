# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules

**These rules override all other instructions:**

1. **NEVER commit directly to main** - Always create a feature branch and submit a pull request
2. **Conventional commits** - Format: `type(scope): description`
3. **GitHub Issues for TODOs** - Use `gh` CLI to manage issues, no local TODO files. Use conventional commit format for issue titles
4. **Pull Request titles** - Use conventional commit format (same as commits)
5. **Branch naming** - Use format: `type/short-description` (e.g., `feat/settings-dialog`)
6. **Working an issue** - Always create a new branch from an updated main branch
7. **Check branch status before pushing** - Verify the remote tracking branch still exists. If a PR was merged/deleted, create a new branch from main instead

---

### GitHub CLI Commands

```bash
gh issue list                    # List open issues
gh issue view <number>           # View details
gh issue create --title "type(scope): description" --body "..."
gh issue close <number>
```

### Conventional Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

---

## Project Overview

This is a GitHub Action (`CodingWithCalvin/GHA-VSVsixVersioner`) that versions Visual Studio extensions (.vsix) using a date-based versioning scheme: `YYYY.M.D.BuildNumber`. It updates both the XML manifest (`source.extension.vsixmanifest`) and the C# code-behind file (`source.extension.cs`) that are synchronized via VSIX Synchronizer.

**Important**: This action only runs on Windows-based GitHub runners.

## Commands

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Run a single test file
npx jest __tests__/main.test.ts

# Run tests with pattern matching
npx jest -t "test name pattern"

# Lint
npm run lint

# Format code
npm run format:write

# Check formatting without changes
npm run format:check

# Build/package the action
npm run package

# Full build (format, lint, test, coverage, package)
npm run all
```

## Architecture

Single-file TypeScript GitHub Action (`src/index.ts`) bundled with `@vercel/ncc` to `dist/index.js`.

**Flow:**
1. Reads `extension-manifest-file` and `extension-source-file` inputs (required)
2. Generates version string: `YYYY.M.D.{build-number}` (build-number defaults to `github.context.runNumber`)
3. Parses XML manifest with `fast-xml-parser`, updates `PackageManifest.Metadata.Identity[@Version]`
4. Updates C# source file by replacing `Version = "x.x.x.x";` pattern via regex
5. Outputs the generated `version` for downstream steps

**Key dependencies:**
- `@actions/core` - GitHub Action I/O and failure handling
- `@actions/github` - GitHub context (run number)
- `fast-xml-parser` - XML parsing/building for vsixmanifest

## Configuration

- ESLint config: `.github/linters/.eslintrc.yml`
- Jest config: embedded in `package.json`
- TypeScript: `tsconfig.json` (ES2022, NodeNext modules, strict mode)
- Node version: specified in `.node-version` file (requires Node >= 21)
