// LICENSE : MIT
"use strict";
import {TextLintCore} from "textlint";
export default function createValidator(options = {}) {
    const textlint = new TextLintCore();
    const rules = options.rules || {};
    const rulesConfig = options.rulesConfig || {};
    const Processors = options.Processors || [];
    textlint.setupRules(rules, rulesConfig);
    Processors.forEach(Processor => {
        textlint.addProcessor(Processor);
    });
    function convertSeverity(severity) {
        switch (severity) {
            case 1:
                return "warning";
            case 2:
                return "error";
            default:
                return "error";
        }
    }

    return function textlintValidator(text, updateLinting) {
        textlint.lintMarkdown(text).then(result => {
            const results = [];
            result.messages.forEach(message => {
                // https://codemirror.net/doc/manual.html
                // the API uses objects with line and ch properties. Both are zero-based.
                const pos = {line: message.line - 1, ch: message.column - 1};
                results.push({
                    from: pos,
                    to: pos,
                    message: message.message,
                    severity: convertSeverity(message.severity)
                });
            });
            updateLinting(results);
        });
    };
}