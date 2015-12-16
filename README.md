# codemirror-textlint

CodeMirror plugin for [textlint](https://github.com/textlint/textlint "textlint").

## Installation

    npm install codemirror-textlint

## Usage

```js
var createValidator = require("codemirror-textlint");
// rule
var noTodo = require("textlint-rule-no-todo");
var validator = createValidator({
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

```

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT