import * as core from '@actions/core'
import * as fs from 'fs'
import * as github from '@actions/github'
import * as xml from 'fast-xml-parser'

const IS_WINDOWS = process.platform === 'win32'

const VSIX_MANIFEST_PATH = core.getInput('extension-manifest-file', {
  required: true
})
const VSIX_SOURCE_PATH = core.getInput('extension-source-file', {
  required: true
})
const BUILD_NUMBER = core.getInput('build-number') || github.context.runNumber
const NOW = new Date()
const VERSION = `${NOW.getFullYear()}.${
  NOW.getMonth() + 1
}.${NOW.getDate()}.${BUILD_NUMBER}`

async function run(): Promise<void> {
  try {
    console.log('********************************')
    console.log(`Version Evaluted = ${VERSION}`)
    console.log('********************************')

    core.setOutput('version', VERSION)

    if (IS_WINDOWS === false) {
      core.setFailed(
        'action-vs-vsix-versioner can only be run on Windows-based runners'
      )
      return
    }

    if (!fs.existsSync(VSIX_MANIFEST_PATH)) {
      core.setFailed(`No VSIX manifest file at: '${VSIX_MANIFEST_PATH}'`)
      return
    }

    if (!fs.existsSync(VSIX_SOURCE_PATH)) {
      core.setFailed(`No VSIX source file at: '${VSIX_SOURCE_PATH}'`)
      return
    }

    fs.readFile(
      VSIX_MANIFEST_PATH,
      { encoding: 'utf-8' },
      function (manifestReadError: NodeJS.ErrnoException | null, data: string) {
        if (manifestReadError) {
          core.setFailed(
            `Unable to READ VSIX Manifest. Error: '${manifestReadError}'`
          )
          return
        }
        const parser = new xml.XMLParser({
          alwaysCreateTextNode: true,
          ignoreAttributes: false
        })
        const jObj = parser.parse(data)

        jObj.PackageManifest.Metadata.Identity['@_Version'] = VERSION

        const builder = new xml.XMLBuilder({
          format: true,
          ignoreAttributes: false,
          processEntities: false,
          indentBy: '     '
        })

        const xmlContent = builder.build(jObj)

        fs.writeFile(
          VSIX_MANIFEST_PATH,
          xmlContent,
          function (err: NodeJS.ErrnoException | null) {
            if (err) {
              core.setFailed(
                `Unable to UPDATE VSIX Manifest File. Error: '${err}'`
              )
              return
            }
          }
        )
      }
    )

    const searchString = /Version\s[=]\s["](?:[0-9\\.]+)["][;]/
    const replacementString = `Version = "${VERSION}";`

    fs.readFile(
      VSIX_SOURCE_PATH,
      { encoding: 'utf-8' },
      function (sourceReadError: NodeJS.ErrnoException | null, data: string) {
        if (sourceReadError) {
          core.setFailed(
            `Unable to READ VSIX Source File. Error: '${sourceReadError}'`
          )
          return
        }
        const updatedData = data.replace(searchString, replacementString)

        fs.writeFile(
          VSIX_SOURCE_PATH,
          updatedData,
          function (err: NodeJS.ErrnoException | null) {
            if (err) {
              core.setFailed(
                `Unable to UPDATE VSIX Source File. Error: '${err}'`
              )
              return
            }
          }
        )
      }
    )
  } catch (err: unknown) {
    if (err instanceof Error) {
      core.setFailed(err.toString())
    }
  }
}

run()
