import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import TypeDoc from 'typedoc'
import { findTokenHasUsed, funcIsAsync, getParamByGeneric, getParamByParameter, getV, getVText } from './scripts/ts-utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const __packageDir = resolve(__dirname, './node_modules/.univer/repo')

const __packageJson = JSON.parse(fs.readFileSync(resolve(__packageDir, './package.json'), 'utf8'))
const __version = __packageJson.version

const __packages = resolve(__packageDir, './packages')
const __output = resolve(__dirname, './api')
const __metaOutput = resolve(__dirname, './package-meta/')

// clean output
if (fs.existsSync(__output)) {
  fs.rmdirSync(__output, { recursive: true })
} else {
  fs.mkdirSync(__output)
}

if (fs.existsSync(__metaOutput)) {
  fs.rmdirSync(__metaOutput, { recursive: true })
  fs.mkdirSync(__metaOutput)
} else {
  fs.mkdirSync(__metaOutput)
}

const packages = fs.readdirSync(__packages)
  .filter((pkg) => {
    const pkgJson = fs.readFileSync(resolve(__packages, pkg, './package.json'), 'utf8')
    const pkgJsonParsed = JSON.parse(pkgJson)

    return !pkgJsonParsed.private
  })

function getCommands(project) {
  const commands = project.children.filter(it => ['ICommand', 'IMultiCommand', 'IMutation', 'IOperation'].includes(it?.type?.name)).map((it) => {
    const name = it.name
    const ast = project.getSymbolFromReflection(it).valueDeclaration
    const type = getVText(ast, 'type')
    const id = getVText(ast, 'id')
    const url = it.sources[0].url
    const description = it.comment?.summary?.[0]?.text || ''

    const handler = getV(ast, 'handler')
    const canUndo = findTokenHasUsed(handler, 'IUndoRedoService')
    const hasDispatched = findTokenHasUsed(handler, 'ICommandService')
    const isAsync = funcIsAsync(handler)

    const params = getParamByGeneric(ast) || getParamByParameter(ast)

    return {
      name,
      type,
      id,
      url,
      description,
      params,
      canUndo,
      isAsync,
      hasDispatched,
    }
  })

  return commands
}

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
    const commands = getCommands(project)
    if (commands.length > 0) {
      const outputMetaFile = resolve(__metaOutput, `${pkg}.json`)
      fs.writeFileSync(outputMetaFile, JSON.stringify(commands, null, 2))
    }

    const outputDir = resolve(__output, pkg)
    await app.generateDocs(project, outputDir)
  }
}
