# codemirror-textlint

CodeMirror 6 linter extension for [textlint](https://github.com/textlint/textlint "textlint") using [@textlint/kernel](https://www.npmjs.com/package/@textlint/kernel).

> **⚠️ Migrating from v1.x?** See the [**Migration Guide**](./MIGRATION.md) for breaking changes and upgrade instructions.

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

```bash
npm install @textlint/textlint-plugin-markdown textlint-rule-no-todo
```

```typescript
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { lintGutter } from "@codemirror/lint";
import { createTextlintLinter } from "codemirror-textlint";
import noTodo from "textlint-rule-no-todo";
import markdownPlugin from "@textlint/textlint-plugin-markdown";

const textlintLinter = createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  },
  plugins: {
    "@textlint/markdown": markdownPlugin
  },
  pluginsConfig: {
    "@textlint/markdown": true
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

### With Plugins (Required for Markdown)

For markdown content, you need to include the markdown plugin:

```bash
npm install @textlint/textlint-plugin-markdown
```

```typescript
import { createTextlintLinter } from "codemirror-textlint";
import markdownPlugin from "@textlint/textlint-plugin-markdown";
import noTodo from "textlint-rule-no-todo";

const textlintLinter = createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  },
  plugins: {
    "@textlint/markdown": markdownPlugin
  },
  pluginsConfig: {
    "@textlint/markdown": true
  }
});
```

### Plain Text (Non-Markdown)

For plain text files without markdown syntax, you need the text plugin:

```bash
npm install @textlint/textlint-plugin-text
```

```typescript
import { createTextlintLinter } from "codemirror-textlint";
import noTodo from "textlint-rule-no-todo";
import textPlugin from "@textlint/textlint-plugin-text";

const textlintLinter = createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  },
  plugins: {
    "@textlint/text": textPlugin
  },
  pluginsConfig: {
    "@textlint/text": true
  },
  ext: ".txt",
  filePath: "document.txt"
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
- `ext?: string` - File extension for textlint processing (default: ".md")
- `filePath?: string` - File path for textlint processing (default: "document.md")

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

## Migration from v1.x

Version 2.0 includes breaking changes. See [**MIGRATION.md**](./MIGRATION.md) for detailed upgrade instructions.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT