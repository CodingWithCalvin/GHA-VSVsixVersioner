# CodingWithCalvin/GHA-VSVsixVersioner

GitHub Action to update your Visual Studio extension to a version that is based
off of the current date and the CI build number.

> _This action requires your extension to utilize the
> [VSIX Synchronizer](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.VsixSynchronizer64)
> model for managing the version in the `source.extension.vsixmanifest` and the
> `source.extension.cs` code-behind file that is automatically synchronized._
>
> _Other versioning styles will be supported in the future_

## Usage

You can use the Visual Studio VSIX Versioner GitHub Action by configuring a
YAML-based workflow file, e.g. .github/workflows/deploy.yml.

> _This action only works on a Windows-based runner_

## Version the VSIX _before_ building

```yml
steps:
  - name: Checkout
    uses: actions/checkout@v2

  - name: Visual Studio VSIX Versioner
    uses: CodingWithCalvin/GHA-VSVsixVersioner@v2.0.0
    with:
      # REQUIRED
      extension-manifest-file: './src/CodingWithCalvin.OpenBinFolder.Vsix/source.extension.vsixmanifest'
      extension-source-file: './src/CodingWithCalvin.OpenBinFolder.Vsix/source.extension.cs'

      # OPTIONAL
      build-number: ${{ github.run_number }}
```

## Inputs

| Input                   | Required | Description                                                                                                 |
| ----------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| extension-manifest-file | Y        | Path to the manifest used for the extension                                                                 |
| extension-source-file   | Y        | Path to the source file generated from the manifest (using VSIX Syncronizer)                                |
| build-number            | N        | Specify the build number you'd like to utilize, otherwise, defaults to the `run_number` of the build itself |
