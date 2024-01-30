import { availablePlugins, transform } from '@babel/standalone'
import * as _$univerjs__core from '@univerjs/core'
import * as _$univerjs__design from '@univerjs/design'
import '@univerjs/design/lib/index.css'
import * as _$univerjs__docs from '@univerjs/docs'
import * as _$univerjs__engine_formula from '@univerjs/engine-formula'
import * as _$univerjs__engine_render from '@univerjs/engine-render'
import * as _$univerjs__facade from '@univerjs/facade'
import * as _$univerjs__sheets from '@univerjs/sheets'
import * as _$univerjs__sheets_formula from '@univerjs/sheets-formula'
import '@univerjs/sheets-formula/lib/index.css'
import * as _$univerjs__sheets_ui from '@univerjs/sheets-ui'
import '@univerjs/sheets-ui/lib/index.css'
import * as _$univerjs__ui from '@univerjs/ui'
import '@univerjs/ui/lib/index.css'
import * as _$wendellhu__redi from '@wendellhu/redi'
import angular2Annotate from 'babel-plugin-angular2-annotations'
import { debounce } from 'lodash-es'
import { editor } from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'

window.core = _$univerjs__core
window.design = _$univerjs__design
window.docs = _$univerjs__docs
window.engineFormula = _$univerjs__engine_formula
window.engineRender = _$univerjs__engine_render
window.sheets = _$univerjs__sheets
window.sheetsFormula = _$univerjs__sheets_formula
window.sheetsUi = _$univerjs__sheets_ui
window.ui = _$univerjs__ui
window.facade = _$univerjs__facade
window.redi = _$wendellhu__redi

const code = `

import { Univer, CommandType, ICellData, ICommandService, IUniverInstanceService, Plugin } from "@univerjs/core";

import { defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin, SetRangeValuesCommand } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverUIPlugin,IMenuService, MenuItemType, MenuPosition } from "@univerjs/ui";
import { IAccessor, Inject, Injector } from '@wendellhu/redi';
import { FUniver } from "@univerjs/facade";

const univer = new Univer({
  theme: defaultTheme,
});

// core plugins
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverFormulaEnginePlugin, {
  notExecuteFormula: true,
});
univer.registerPlugin(UniverUIPlugin, {
  container: "app", // DOM container id
  header: true,
  toolbar: true,
  footer: true,
});

// doc plugins
univer.registerPlugin(UniverDocsPlugin, {
  hasScroll: false,
});

// sheet plugins
univer.registerPlugin(UniverSheetsPlugin, {
  notExecuteFormula: true,
});
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverSheetsFormulaPlugin);

/**
 * wait user select csv file
 */
const waitUserSelectCSVFile = (onSelect) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.click();

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      if (typeof text !== 'string') return;

      // tip: use npm package to parse csv
      const rows = text.split(/\\r\\n|\\n/);
      const data = rows.map(line => line.split(','));

      const colsCount = data.reduce((max, row) => Math.max(max, row.length), 0);

      onSelect({
        data,
        colsCount,
        rowsCount: data.length,
      });
    };
    reader.readAsText(file);
  };


}

/**
 * parse csv to univer data
 * @param csv 
 * @returns { v: string }[][]
 */
const parseCSV2UniverData = (csv) => {
  return csv.map((row) => {
    return row.map((cell) => {
      return {
        v: cell || '',
      }
    })
  })
}

/**
 * Import CSV Button Plugin 
 * A simple Plugin example, show how to write a plugin.
 */
class ImportCSVButtonPlugin extends Plugin {
  constructor (
    // inject injector, required
    @Inject(Injector) _injector,
    // inject menu service, to add toolbar button
    @Inject(IMenuService)  menuService,
    // inject command service, to register command handler
    @Inject(ICommandService)  commandService
  ) {
    // plugin id
    super('import-csv-plugin');
    
    this._injector = _injector;
    this.menuService = menuService;
    this.commandService = commandService;
  }

  /**
   * The first lifecycle of the plugin mounted on the Univer instance,
   * the Univer business instance has not been created at this time.
   * The plugin should add its own module to the dependency injection system at this lifecycle.
   * It is not recommended to initialize the internal module of the plugin outside this lifecycle.
   */
  onStarting () {
    const buttonId = 'import-csv-button';


    const menuItem = {
      id: buttonId,
      title: 'Import CSV',
      tooltip: 'Import CSV',
      icon: 'CodeSingle',
      type: MenuItemType.BUTTON,
      positions: [MenuPosition.TOOLBAR_START],
    }
    this.menuService.addMenuItem(menuItem);

    const command = {
      type: CommandType.OPERATION,
      id: buttonId,
      handler: (accessor) => {
        // inject univer instance service
        const univer = accessor.get(IUniverInstanceService);
        const commandService = accessor.get(ICommandService);
        // get current sheet
        const sheet = univer.getCurrentUniverSheetInstance().getActiveSheet();
        // wait user select csv file
        waitUserSelectCSVFile(({ data, rowsCount, colsCount }) => {
          // set sheet size
          sheet.setColumnCount(colsCount);
          sheet.setRowCount(rowsCount);

          // set sheet data
          commandService.executeCommand(SetRangeValuesCommand.id, {
            range: {
              startColumn: 2,
              startRow: 2,
              endColumn: colsCount - 1,
              endRow: rowsCount - 1,
            },
            value: parseCSV2UniverData(data),
          })
        })
        return true;
      }
    }
    this.commandService.registerCommand(command);
  }
}

univer.registerPlugin(ImportCSVButtonPlugin);
univer.createUniverSheet({});

const univerAPI = FUniver.newAPI(univer);

console.log(univerAPI);

`

function PlaygroundPage() {
  const editorRef = useRef<HTMLElement | null>(null)
  const monacoEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const scriptRef = useRef<HTMLElement | null>(null)
  const univerDOMRef = useRef<HTMLElement | null>(null)
  const [transformCode, setTransformCode] = useState('')

  useEffect(() => {
    const monacoEditor = (monacoEditorRef.current = editor.create(editorRef.current!, {
      value: code,
      language: 'javascript',
    }))

    let renderTime = 0
    const onDidChangeModelContent = debounce(() => {
      const value = monacoEditor.getValue()

      try {
        const { code } = transform(value, {
          filename: 'test.tsx',
          presets: [],
          plugins: [
            [
              angular2Annotate,
            ],
            [
              'transform-modules-umd',
              {
                globals: {
                  '@univerjs/core': 'Univer',
                },
              },
            ],
            [
              availablePlugins['proposal-decorators'],
              {
                version: 'legacy',
              },
            ],
          ],
        })
        setTransformCode(code)
        const script = document.createElement('script')
        script.innerHTML = `
          try {
            if(window._univerInstance) {
              window._univerInstance.dispose();
            }
            ${code}

            window._univerInstance = univer;
          } catch(e) {
            if (window.__reportErrorInPlayGround) {
              window.__reportErrorInPlayGround(e);
            }
          }
        `

        scriptRef.current!.innerHTML = ''
        scriptRef.current!.appendChild(script)
        renderTime = Date.now()
      } catch (error) {
        // to tip
      }
    }, 1000)

    window.__reportErrorInPlayGround = () => {
      // to report error
    }

    monacoEditor.onDidChangeModelContent(onDidChangeModelContent)

    monacoEditor.onDidBlurEditorWidget(() => {
      // 2s 内 render 导致的失去焦点，需要恢复焦点
      if (Date.now() - renderTime < 5000) {
        monacoEditor.focus()
      }
    })

    return () => {
      monacoEditor.dispose()
    }
  }, [])

  return (
<div>
    <div style={{ display: 'flex', height: '500px', width: '100%' }}>
      <div style={{ flex: 1, border: '1px solid #ddd' }} ref={(ref) => { editorRef.current = ref }}></div>
      <div id="app" style={{ flex: 1 }} ref={(ref) => { univerDOMRef.current = ref }}></div>
    </div>
    <div ref={(ref) => { scriptRef.current = ref }}></div>
    <div style={{ overflow: 'auto' }}>
      <pre>{transformCode}</pre>
    </div>
</div>
  )
}

export default PlaygroundPage
