import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import TypeDoc from 'typedoc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const __packageDir = resolve(__dirname, './node_modules/.univer/repo')

const __packageJson = JSON.parse(fs.readFileSync(resolve(__packageDir, './package.json'), 'utf8'))
const __version = __packageJson.version

const __packages = resolve(__packageDir, './packages')
const __output = resolve(__dirname, './api')

// clean output
if (fs.existsSync(__output)) {
  fs.rmdirSync(__output, { recursive: true })
} else {
  fs.mkdirSync(__output)
}

const packages = fs.readdirSync(__packages)
  .filter((pkg) => {
    const pkgJson = fs.readFileSync(resolve(__packages, pkg, './package.json'), 'utf8')
    const pkgJsonParsed = JSON.parse(pkgJson)

    return !pkgJsonParsed.private
  })

for (const pkg of packages) {
  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: resolve(__packages, pkg, 'src/index.ts'),
    tsconfig: resolve(__packages, pkg, 'tsconfig.json'),
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
    customCss: './style.css',
    readme: 'none',
    hideGenerator: true,
    includeVersion: true,
    basePath: resolve(__packageDir),
    sourceLinkTemplate: `https://github.com/dream-num/univer/blob/v${__version}/{path}#L{line}`,
  })

  const project = await app.convert()

  if (project) {
    const outputDir = resolve(__output, pkg)
    await app.generateDocs(project, outputDir)
  }
}
