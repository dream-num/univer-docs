import { execSync } from 'node:child_process'
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  rmdirSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import TypeDoc from 'typedoc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class ApiGenerator {
  cloneRoot = ''
  repoRoot = ''

  packagesPath = ''
  packages = []

  constructor(cloneRoot) {
    this.cloneRoot = cloneRoot

    if (existsSync(this.cloneRoot)) {
      execSync('git pull', { cwd: this.cloneRoot })
    } else {
      // const branch = 'main'
      const branch = 'dev'
      execSync(`git clone --depth 1 -b ${branch} https://github.com/dream-num/univer.git ${this.cloneRoot}`)
    }

    execSync('pnpm install', { cwd: this.cloneRoot })

    this.packagesPath = resolve(this.cloneRoot, './packages')
    this.packages = readdirSync(this.packagesPath)
      .filter((pkg) => {
        const pkgJson = readFileSync(resolve(this.packagesPath, pkg, './package.json'), 'utf8')
        const pkgJsonParsed = JSON.parse(pkgJson)

        return !pkgJsonParsed.private
      })
  }

  static cleanOutput(outputRoot) {
    if (existsSync(outputRoot)) {
      rmdirSync(outputRoot, { recursive: true })
    } else {
      mkdirSync(outputRoot)
    }
  }

  generatePluginsReadme(output) {
    const packagesPath = resolve(this.cloneRoot, './packages')

    for (const pkg of this.packages) {
      const readme = resolve(packagesPath, pkg, 'readme.md')
      const assets = resolve(packagesPath, pkg, 'assets')

      if (existsSync(readme)) {
        if (!existsSync(resolve(output, pkg))) {
          mkdirSync(resolve(output, pkg), { recursive: true })
        }

        if (existsSync(assets)) {
          cpSync(assets, resolve(output, pkg, 'assets'), { recursive: true })
        }

        const content = readFileSync(readme, 'utf8')
          .replace(`# @univerjs/${pkg}`, `---\ntitle: '@univerjs/${pkg}'\n---For all the available APIs, please refer to the [api detail page](/api/${pkg}/detail.html)`)

        writeFileSync(resolve(output, pkg, 'index.md'), content)
      }
    }
  }

  async generateDocs(outputRoot) {
    const { version } = JSON.parse(readFileSync(resolve(this.cloneRoot, './package.json'), 'utf8'))
    const customCss = resolve(__dirname, './style.css')

    for (const pkg of this.packages) {
      const app = await TypeDoc.Application.bootstrapWithPlugins({
        entryPoints: resolve(this.packagesPath, pkg, 'src/index.ts'),
        tsconfig: resolve(this.packagesPath, pkg, 'tsconfig.json'),
        externalPattern: [
          '**/node_modules/univer/node_modules/**',
          '**/.pnpm/**',
        ],
        excludeExternals: true,
        excludeInternal: true,
        excludePrivate: true,
        excludeProtected: true,
        disableGit: true,
        disableSources: false,
        customCss,
        name: `@univerjs/${pkg}`,
        readme: 'none',
        hideGenerator: true,
        includeVersion: true,
        basePath: resolve(this.cloneRoot),
        sourceLinkTemplate: `https://github.com/dream-num/univer/blob/v${version}/{path}#L{line}`,
        navigation: {
          includeCategories: true,
          includeGroups: true,
          includeFolders: true,
        },
      })

      const project = await app.convert()

      if (project) {
        const outputDir = resolve(outputRoot, pkg)
        await app.generateDocs(project, outputDir)

        // rename index.html to detail.html
        const indexHtml = resolve(outputDir, 'index.html')
        if (existsSync(indexHtml)) {
          copyFileSync(indexHtml, resolve(outputDir, 'detail.html'))
          rmSync(indexHtml)
        }
      }
    }
  }
}
