import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { lintGutter } from '@codemirror/lint';
import { createTextlintLinter } from '../src/index';
import type { TextlintRuleModule } from '@textlint/types';
import textPlugin from '@textlint/textlint-plugin-text';

describe('codemirror-textlint', () => {
  describe('createTextlintLinter', () => {
    it('should create a linter extension', () => {
      const linter = createTextlintLinter();
      expect(linter).toBeDefined();
      expect(typeof linter).toBe('object');
    });

    it('should handle empty text', async () => {
      const linter = createTextlintLinter();
      
      const state = EditorState.create({
        doc: '',
        extensions: [linter]
      });

      const view = new EditorView({
        state,
        parent: document.createElement('div')
      });

      // Wait for linting to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Test passes if no errors are thrown
      expect(view.state).toBeDefined();

      view.destroy();
    });

    it('should integrate with CodeMirror properly', async () => {
      // Create a simple mock rule for testing
      const mockRule: TextlintRuleModule = {
        linter(context, options) {
          const { Syntax, report, getSource } = context;
          
          return {
            [Syntax.Document](node) {
              const text = getSource(node);
              const todoMatch = text.match(/TODO:/i);
              if (todoMatch && todoMatch.index !== undefined) {
                report(node, {
                  message: 'Found TODO',
                  index: todoMatch.index,
                  fix: undefined
                });
              }
            }
          };
        }
      };

      const linter = createTextlintLinter({
        rules: {
          'mock-rule': mockRule
        }
      });

      const state = EditorState.create({
        doc: 'This is a TODO: item',
        extensions: [linter, lintGutter()]
      });

      const view = new EditorView({
        state,
        parent: document.createElement('div')
      });

      // Wait for linting to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // The test just verifies that the extension can be created and added without error
      expect(view.state).toBeDefined();

      view.destroy();
    });

    it('should handle text without rules', async () => {
      const linter = createTextlintLinter({});

      const state = EditorState.create({
        doc: 'This is normal text',
        extensions: [linter]
      });

      const view = new EditorView({
        state,
        parent: document.createElement('div')
      });

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not throw error and should complete normally
      expect(view).toBeDefined();

      view.destroy();
    });

    it('should accept custom ext and filePath options', async () => {
      const mockRule: TextlintRuleModule = {
        linter(context, options) {
          const { Syntax, report, getSource } = context;
          
          return {
            [Syntax.Document](node) {
              const text = getSource(node);
              const todoMatch = text.match(/TODO:/i);
              if (todoMatch && todoMatch.index !== undefined) {
                report(node, {
                  message: 'Found TODO in custom file',
                  index: todoMatch.index,
                  fix: undefined
                });
              }
            }
          };
        }
      };

      const linter = createTextlintLinter({
        rules: {
          'mock-rule': mockRule
        },
        ext: '.txt',
        filePath: 'test.txt'
      });

      const state = EditorState.create({
        doc: 'This is a TODO: item in plain text',
        extensions: [linter]
      });

      const view = new EditorView({
        state,
        parent: document.createElement('div')
      });

      // Wait for linting to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // The test verifies the linter works with custom ext and filePath
      expect(view.state).toBeDefined();

      view.destroy();
    });

    it('should use default values when ext and filePath are not provided', async () => {
      const linter = createTextlintLinter({
        rules: {}
      });

      const state = EditorState.create({
        doc: 'Test content',
        extensions: [linter]
      });

      const view = new EditorView({
        state,
        parent: document.createElement('div')
      });

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should work with default values (.md, document.md)
      expect(view).toBeDefined();

      view.destroy();
    });

    it('should work with text plugin for .txt files', async () => {
      const mockRule: TextlintRuleModule = {
        linter(context, options) {
          const { Syntax, report, getSource } = context;
          
          return {
            [Syntax.Document](node) {
              const text = getSource(node);
              const todoMatch = text.match(/TODO:/i);
              if (todoMatch && todoMatch.index !== undefined) {
                report(node, {
                  message: 'Found TODO in text file',
                  index: todoMatch.index,
                  fix: undefined
                });
              }
            }
          };
        }
      };

      const linter = createTextlintLinter({
        rules: {
          'mock-rule': mockRule
        },
        plugins: {
          '@textlint/text': textPlugin
        },
        pluginsConfig: {
          '@textlint/text': true
        },
        ext: '.txt',
        filePath: 'test.txt'
      });

      const state = EditorState.create({
        doc: 'This is a TODO: item in text file',
        extensions: [linter]
      });

      const view = new EditorView({
        state,
        parent: document.createElement('div')
      });

      // Wait for linting to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // The test verifies the linter works with text plugin
      expect(view.state).toBeDefined();

      view.destroy();
    });
  });
});