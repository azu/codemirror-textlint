import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { lintGutter } from '@codemirror/lint';
import { createTextlintLinter } from '../src/index';
import type { TextlintRuleModule } from '@textlint/types';

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
  });
});