# Migration Guide: codemirror-textlint v1.x to v2.x

This guide helps you migrate from codemirror-textlint v1.x to v2.x, which includes significant updates to both CodeMirror (v5 → v6) and textlint (v8 → @textlint/kernel v15).

## Overview of Changes

### Major Updates
- **CodeMirror 5 → CodeMirror 6**: Complete rewrite with new extension system
- **textlint v8 → @textlint/kernel v15**: Modern textlint kernel API
- **CommonJS → Pure ESM**: Module system modernization
- **JavaScript → TypeScript**: Full type safety
- **Mocha → Vitest**: Modern testing framework
- **Manual build → Vite**: Development server and build tooling

## Breaking Changes

### 1. CodeMirror API Complete Rewrite

#### Before (v1.x)
```javascript
const CodeMirror = require('codemirror');
const textlintCodeMirror = require('codemirror-textlint');

// Initialize CodeMirror 5
const editor = CodeMirror.fromTextArea(document.getElementById('textarea'), {
  mode: 'markdown',
  lineNumbers: true,
  lint: {
    getAnnotations: textlintCodeMirror({
      rules: {
        'no-todo': require('textlint-rule-no-todo')
      }
    })
  }
});
```

#### After (v2.x)
```typescript
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { lintGutter } from "@codemirror/lint";
import { createTextlintLinter } from "codemirror-textlint";
import noTodo from "textlint-rule-no-todo";

// Initialize CodeMirror 6
const textlintLinter = createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  }
});

const editor = new EditorView({
  doc: "Your markdown content here",
  extensions: [
    basicSetup,
    markdown(),
    lintGutter(),
    textlintLinter
  ],
  parent: document.getElementById("editor")
});
```

### 2. Module System: CommonJS → ESM

#### Before (CommonJS)
```javascript
const textlintCodeMirror = require('codemirror-textlint');
const noTodo = require('textlint-rule-no-todo');

module.exports = {
  // configuration
};
```

#### After (ESM)
```typescript
import { createTextlintLinter } from "codemirror-textlint";
import noTodo from "textlint-rule-no-todo";

export default {
  // configuration
};
```

### 3. Configuration API Changes

#### Before (v1.x)
```javascript
// Simple rule configuration
textlintCodeMirror({
  rules: {
    'no-todo': require('textlint-rule-no-todo')
  }
})

// With rule options (mixed in rules object)
textlintCodeMirror({
  rules: {
    'no-todo': require('textlint-rule-no-todo'),
    'max-length': {
      rule: require('textlint-rule-max-ten'),
      options: { max: 100 }
    }
  }
})
```

#### After (v2.x)
```typescript
// Separate rules and configuration
createTextlintLinter({
  rules: {
    "no-todo": noTodo,
    "max-length": maxLength
  },
  rulesConfig: {
    "no-todo": true,
    "max-length": { max: 100 }
  }
})

// With plugins
createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  },
  plugins: {
    "markdown": markdownPlugin
  },
  pluginsConfig: {
    "markdown": true
  }
})
```

## Step-by-Step Migration

### Step 1: Update Dependencies

Remove old dependencies:
```bash
npm uninstall codemirror@5 codemirror-textlint@1
```

Install new dependencies:
```bash
npm install codemirror@6 codemirror-textlint@2
```

### Step 2: Update Package Configuration

If using in a Node.js project, update your `package.json`:
```json
{
  "type": "module"
}
```

For TypeScript projects, ensure your `tsconfig.json` supports ESM:
```json
{
  "compilerOptions": {
    "module": "ES2022",
    "target": "ES2022",
    "moduleResolution": "node"
  }
}
```

### Step 3: Update HTML Structure

#### Before (v1.x)
```html
<textarea id="textarea">Your content here</textarea>
<script src="your-codemirror-setup.js"></script>
```

#### After (v2.x)
```html
<div id="editor"></div>
<script type="module" src="your-codemirror-setup.js"></script>
```

### Step 4: Update JavaScript/TypeScript Code

#### Before (v1.x)
```javascript
const CodeMirror = require('codemirror');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/lint/lint');
const textlintCodeMirror = require('codemirror-textlint');

const editor = CodeMirror.fromTextArea(document.getElementById('textarea'), {
  mode: 'markdown',
  lineNumbers: true,
  lint: {
    getAnnotations: textlintCodeMirror({
      rules: {
        'no-todo': require('textlint-rule-no-todo')
      }
    })
  }
});
```

#### After (v2.x)
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
  doc: "Your initial content",
  extensions: [
    basicSetup,
    markdown(),
    lintGutter(),
    textlintLinter
  ],
  parent: document.getElementById("editor")
});
```

### Step 5: Update CSS (if needed)

CodeMirror 6 uses different CSS classes. Update your stylesheets:

#### Before (v1.x)
```css
.CodeMirror {
  height: 400px;
}

.CodeMirror-lint-tooltip {
  /* custom lint tooltip styles */
}
```

#### After (v2.x)
```css
.cm-editor {
  height: 400px;
}

.cm-tooltip-lint {
  /* custom lint tooltip styles */
}
```

## Advanced Migration Scenarios

### Custom Rule Integration

#### Before (v1.x)
```javascript
// Custom rule with old textlint API
const customRule = {
  linter: function(context) {
    // v8 textlint API
    return {
      'Str': function(node) {
        // rule logic
      }
    };
  }
};

textlintCodeMirror({
  rules: {
    'custom': customRule
  }
});
```

#### After (v2.x)
```typescript
// Custom rule with @textlint/kernel API
const customRule: TextlintRuleModule = {
  linter: function(context) {
    // v15 @textlint/kernel API
    return {
      'Str': function(node) {
        // rule logic - API mostly compatible
      }
    };
  }
};

createTextlintLinter({
  rules: {
    "custom": customRule
  },
  rulesConfig: {
    "custom": true
  }
});
```

### Build System Integration

#### Before (v1.x)
```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  // CommonJS build
};
```

#### After (v2.x)
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // ESM build with Vite
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es']
    }
  }
});
```

## New Features in v2.x

### TypeScript Support
```typescript
import type { TextlintLinterOptions, TextlintRuleModule } from "codemirror-textlint";

const options: TextlintLinterOptions = {
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  }
};
```

### Filter Rules
```typescript
import filterRule from "textlint-filter-rule-comments";

createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  },
  filterRules: {
    "comments": filterRule
  },
  filterRulesConfig: {
    "comments": true
  }
});
```

### Plugin System
```typescript
import markdownPlugin from "@textlint/textlint-plugin-markdown";

createTextlintLinter({
  rules: {
    "no-todo": noTodo
  },
  rulesConfig: {
    "no-todo": true
  },
  plugins: {
    "markdown": markdownPlugin
  },
  pluginsConfig: {
    "markdown": true
  }
});
```

## Troubleshooting

### Common Issues

1. **"Cannot use import statement outside a module"**
   - Add `"type": "module"` to your `package.json`
   - Use `.mjs` file extension
   - Update your bundler configuration

2. **"TextlintKernel is not exported"**
   - Ensure you're using @textlint/kernel v15+
   - Check import syntax: `import * as textlintKernel from "@textlint/kernel"`

3. **"process is not defined"**
   - Configure your bundler to polyfill Node.js globals
   - For Vite: add process polyfill in config

4. **CodeMirror editor not appearing**
   - Ensure you have a target element: `<div id="editor"></div>`
   - Check that all CodeMirror 6 extensions are properly imported

### Performance Considerations

- CodeMirror 6 is generally faster than v5
- @textlint/kernel v15 has better performance than v8
- ESM enables better tree-shaking for smaller bundles
- Vite provides faster development builds

## Migration Checklist

- [ ] Update dependencies (CodeMirror 5→6, codemirror-textlint 1→2)
- [ ] Change package.json to `"type": "module"`
- [ ] Update imports from CommonJS to ESM
- [ ] Replace `CodeMirror.fromTextArea()` with `new EditorView()`
- [ ] Update configuration API to use `createTextlintLinter()`
- [ ] Separate rules and rulesConfig
- [ ] Update HTML structure (textarea → div)
- [ ] Update CSS classes (CodeMirror → cm-*)
- [ ] Test all textlint rules work correctly
- [ ] Update build system to handle ESM
- [ ] Update TypeScript configuration if applicable

## Resources

- [CodeMirror 6 Migration Guide](https://codemirror.net/docs/migration/)
- [@textlint/kernel Documentation](https://textlint.github.io/docs/use-as-modules.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [ESM Migration Guide](https://nodejs.org/api/esm.html)

For additional help, please check the [Issues](https://github.com/azu/codemirror-textlint/issues) or create a new issue on GitHub.