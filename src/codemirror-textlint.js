// LICENSE : MIT
"use strict";
import {TextLintCore} from "textlint";
export default function textlintValidator(options = {}) {
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

    return (text, updateLinting) => {
        textlint.lintMarkdown(text).then(result => {
            const results = [];
            result.messages.forEach(message => {
                results.push({
                    from: CodeMirror.Pos(message.line - 1, message.column),
                    to: CodeMirror.Pos(message.line - 1, message.column),
                    message: message.message,
                    severity: convertSeverity(message.severity)
                });
            });
            updateLinting(results);
        });
    };
}