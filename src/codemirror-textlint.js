// LICENSE : MIT
"use strict";
import {TextLintCore} from "textlint";
export default function textlintValidator(options = {}) {
    const textlint = new TextLintCore();
    const rules = options.rules || {};
    const rulesConfig = options.rulesConfig || {};
    textlint.setupRules(rules, rulesConfig);

    return (cm, updateLinting, options) => {
        const text = cm.getValue();
        textlint.lintMarkdown(text).then(result => {
            const results = [];
            result.messages.forEach(message => {
                results.push({
                    from: CodeMirror.Pos(message.loc.start.line, message.loc.start.column),
                    to: CodeMirror.Pos(message.loc.end.line, message.loc.end.column),
                    message: message.message
                });
            });
            updateLinting(results);
        });
    };
}