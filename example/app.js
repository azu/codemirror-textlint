// LICENSE : MIT
"use strict";
var textlintValidator = require("codemirror-textlint");
var noTodo = require("textlint-rule-no-todo");
var validator = textlintValidator({
    rules: {
        "no-todo": noTodo
    }
});
var editor = CodeMirror.fromTextArea(document.getElementById("code-md"), {
    lineNumbers: true,
    mode: "markdown",
    gutters: ["CodeMirror-lint-markers"],
    lint: {
        "getAnnotations": validator,
        "async": true
    }
});
