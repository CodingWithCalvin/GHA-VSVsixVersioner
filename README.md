# Visual Studio VSIX Versioner

[![Build](https://img.shields.io/github/actions/workflow/status/CodingWithCalvin/GHA-VSVsixVersioner/build.yml?style=for-the-badge&label=Build)](https://github.com/CodingWithCalvin/GHA-VSVsixVersioner/actions/workflows/build.yml)
[![GitHub release](https://img.shields.io/github/v/release/CodingWithCalvin/GHA-VSVsixVersioner?style=for-the-badge)](https://github.com/CodingWithCalvin/GHA-VSVsixVersioner/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

🏷️ Version your Visual Studio extensions automatically based on date and build
number!

This GitHub Action updates your Visual Studio extension to a version based on
the current date and CI build number.

## 🚀 Usage

You can use the Visual Studio VSIX Versioner GitHub Action by configuring a
YAML-based workflow file, e.g. `.github/workflows/deploy.yml`.

> ⚠️ **Note:** This action requires your extension to utilize the
> [VSIX Synchronizer](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.VsixSynchronizer64)
> model for managing the version in the `source.extension.vsixmanifest` and the
> `source.extension.cs` code-behind file that is automatically synchronized.
>
> Other versioning styles will be supported in the future.

> ⚠️ **Note:** This action only works on a Windows-based runner.

## 📥 Inputs

| Input                     | Required | Description                                                                   |
| ------------------------- | -------- | ----------------------------------------------------------------------------- |
| `extension-manifest-file` | Yes      | Path to your `source.extension.vsixmanifest` file                             |
| `extension-source-file`   | Yes      | Path to the source file generated from the manifest (using VSIX Synchronizer) |
| `build-number`            | No       | Build number to use for versioning (defaults to `run_number`)                 |

## 📋 Example

Version the VSIX **before** building:

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Visual Studio VSIX Versioner
    uses: CodingWithCalvin/GHA-VSVsixVersioner@v2
    with:
      # REQUIRED
      extension-manifest-file: './src/MyExtension/source.extension.vsixmanifest'
      extension-source-file: './src/MyExtension/source.extension.cs'

      # OPTIONAL
      build-number: ${{ github.run_number }}
```

## 👥 Contributors

<!-- readme: contributors -start -->

[![CalvinAllen](https://avatars.githubusercontent.com/u/41448698?v=4&s=64)](https://github.com/CalvinAllen)

<!-- readme: contributors -end -->

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Made with ❤️ by Coding With Calvin
