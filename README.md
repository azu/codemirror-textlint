# codemirror-textlint

CodeMirror 6 linter extension for [textlint](https://github.com/textlint/textlint "textlint") using [@textlint/kernel](https://www.npmjs.com/package/@textlint/kernel).

## Installation

```bash
npm install codemirror-textlint
```

Note: This package requires CodeMirror 6 as a peer dependency:

```bash
npm install codemirror
```

## Usage

### Basic Usage

```typescript
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { lintGutter } from "@codemirror/lint";
import { createTextlintLinter } from "codemirror-textlint";
import noTodo from "textlint-rule-no-todo";

const textlintLinter = createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  }
});

const editor = new EditorView({
  doc: "This is a TODO: item in markdown",
  extensions: [
    basicSetup,
    markdown(),
    lintGutter(),
    textlintLinter
  ],
  parent: document.getElementById("editor")
});
```

### Advanced Configuration

```typescript
import { createTextlintLinter } from "codemirror-textlint";
import noTodo from "textlint-rule-no-todo";
import noExclamationQuestionMark from "textlint-rule-no-exclamation-question-mark";

const textlintLinter = createTextlintLinter({
  rules: {
    "no-todo": noTodo,
    "no-exclamation-question-mark": noExclamationQuestionMark
  },
  rulesConfig: {
    "no-todo": true,
    "no-exclamation-question-mark": {
      "allowHalfWidthExclamation": true,
      "allowFullWidthExclamation": false,
      "allowHalfWidthQuestion": true,
      "allowFullWidthQuestion": false
    }
  }
});
```

### With Plugins

```typescript
import { createTextlintLinter } from "codemirror-textlint";
import markdownPlugin from "@textlint/textlint-plugin-markdown";

const textlintLinter = createTextlintLinter({
  rules: {
    // your rules
  },
  plugins: {
    "markdown": markdownPlugin
  },
  pluginsConfig: {
    "markdown": true
  }
});
```

## API

### `createTextlintLinter(options?: TextlintLinterOptions)`

Creates a CodeMirror 6 linter extension for textlint.

#### Options

- `rules?: Record<string, TextlintRuleModule>` - Textlint rules to use
- `rulesConfig?: Record<string, any>` - Configuration for each rule  
- `plugins?: Record<string, TextlintPluginCreator>` - Textlint plugins for different file formats
- `pluginsConfig?: Record<string, any>` - Configuration for plugins
- `filterRules?: Record<string, TextlintFilterRuleReporter>` - Filter rules to suppress certain messages
- `filterRulesConfig?: Record<string, any>` - Configuration for filter rules

Returns a linter extension that can be added to CodeMirror 6's extensions array.
## Development

### Running Tests

```bash
npm test
```

### Development Server

```bash
npm run dev
```

This will start a Vite development server at http://localhost:3000 with the example.

### Building

```bash
npm run build
```

## Migration Guide

### Migrating from 1.x to 2.x

Version 2.0 introduces breaking changes due to the migration from CodeMirror 5 to CodeMirror 6 and from textlint v8 to @textlint/kernel v15.

#### Major Changes

1. **CodeMirror 6 Migration**: Now uses CodeMirror 6's extension system
2. **@textlint/kernel v15**: Migrated from legacy textlint API to modern @textlint/kernel
3. **Pure ESM**: Package is now pure ESM (no CommonJS support)
4. **TypeScript**: Full TypeScript support with type definitions
5. **Vite Development**: Uses Vite for development and building

#### Breaking Changes

##### CodeMirror API Changes

**Before (v1.x with CodeMirror 5):**
```javascript
const CodeMirror = require('codemirror');
const textlintCodeMirror = require('codemirror-textlint');

const editor = CodeMirror.fromTextArea(textarea, {
  mode: 'markdown',
  lint: {
    getAnnotations: textlintCodeMirror({
      rules: {
        'no-todo': require('textlint-rule-no-todo')
      }
    })
  }
});
```

**After (v2.x with CodeMirror 6):**
```typescript
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { lintGutter } from "@codemirror/lint";
import { createTextlintLinter } from "codemirror-textlint";
import noTodo from "textlint-rule-no-todo";

const textlintLinter = createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  }
});

const editor = new EditorView({
  extensions: [
    basicSetup,
    markdown(),
    lintGutter(),
    textlintLinter
  ],
  parent: document.getElementById("editor")
});
```

##### Module System

**Before (CommonJS):**
```javascript
const textlintCodeMirror = require('codemirror-textlint');
```

**After (ESM):**
```typescript
import { createTextlintLinter } from "codemirror-textlint";
```

##### Configuration Changes

**Before (v1.x):**
```javascript
textlintCodeMirror({
  rules: {
    'no-todo': require('textlint-rule-no-todo')
  }
})
```

**After (v2.x):**
```typescript
createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  }
})
```

#### Migration Steps

1. **Update Dependencies**:
   ```bash
   npm uninstall codemirror@5
   npm install codemirror@6 codemirror-textlint@2
   ```

2. **Update Package Type**: If using in a Node.js project, update your `package.json`:
   ```json
   {
     "type": "module"
   }
   ```

3. **Update Imports**: Change from CommonJS require to ESM imports

4. **Update CodeMirror Setup**: Follow the CodeMirror 6 migration guide and use the new extension system

5. **Update Configuration**: Use the new `createTextlintLinter` API with separate `rules` and `rulesConfig`

#### New Features in v2.x

- **TypeScript Support**: Full type definitions included
- **Modern textlint**: Uses @textlint/kernel v15 for better performance
- **Vite Development**: Fast development server with HMR
- **GitHub Pages**: Automatic deployment of examples
- **Vitest**: Modern testing framework
- **Pure ESM**: Better tree-shaking and modern module support

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT