import { linter, Diagnostic } from "@codemirror/lint";
import * as textlintKernel from "@textlint/kernel";
import type { TextlintKernelRule, TextlintKernelFilterRule, TextlintKernelPlugin } from "@textlint/kernel";
import type { TextlintRuleModule, TextlintFilterRuleReporter, TextlintPluginCreator, TextlintMessage } from "@textlint/types";

const { TextlintKernel } = textlintKernel;

export interface TextlintLinterOptions {
  rules?: Record<string, TextlintRuleModule>;
  rulesConfig?: Record<string, any>;
  plugins?: Record<string, TextlintPluginCreator>;
  pluginsConfig?: Record<string, any>;
  filterRules?: Record<string, TextlintFilterRuleReporter>;
  filterRulesConfig?: Record<string, any>;
}

function convertSeverity(severity: number): "error" | "warning" | "info" {
  switch (severity) {
    case 1:
      return "warning";
    case 2:
      return "error";
    case 3:
      return "info";
    default:
      return "error";
  }
}

export function createTextlintLinter(options: TextlintLinterOptions = {}) {
  const { 
    rules = {}, 
    rulesConfig = {}, 
    plugins = {}, 
    pluginsConfig = {},
    filterRules = {}, 
    filterRulesConfig = {} 
  } = options;

  // Convert rules to kernel format
  const kernelRules: TextlintKernelRule[] = Object.entries(rules).map(([ruleId, rule]) => ({
    ruleId,
    rule,
    options: rulesConfig[ruleId] ?? true
  }));

  // Convert filter rules to kernel format
  const kernelFilterRules: TextlintKernelFilterRule[] = Object.entries(filterRules).map(([ruleId, rule]) => ({
    ruleId,
    rule,
    options: filterRulesConfig[ruleId] ?? true
  }));

  // Convert plugins to kernel format
  const kernelPlugins: TextlintKernelPlugin[] = Object.entries(plugins).map(([pluginId, plugin]) => ({
    pluginId,
    plugin,
    options: pluginsConfig[pluginId] ?? true
  }));

  const textlintKernel = new TextlintKernel();

  return linter(async (view) => {
    const content = view.state.doc.toString();
    
    // If no rules, return early
    if (kernelRules.length === 0) {
      return [];
    }
    
    try {
      const result = await textlintKernel.lintText(content, {
        ext: ".md",
        filePath: "document.md",
        rules: kernelRules,
        filterRules: kernelFilterRules,
        plugins: kernelPlugins
      });

      const diagnostics: Diagnostic[] = result.messages.map((message: TextlintMessage) => {
        // CodeMirror 6 uses 0-based positions
        const from = view.state.doc.line(message.loc.start.line).from + message.loc.start.column - 1;
        const to = view.state.doc.line(message.loc.end.line).from + message.loc.end.column - 1;

        return {
          from,
          to,
          severity: convertSeverity(message.severity),
          message: message.message,
          source: message.ruleId
        };
      });

      return diagnostics;
    } catch (error) {
      console.error("Textlint error:", error);
      return [];
    }
  });
}

// Re-export types for convenience
export type { TextlintRuleModule, TextlintPluginCreator, TextlintFilterRuleReporter } from "@textlint/types";
export type { TextlintMessage } from "@textlint/types";