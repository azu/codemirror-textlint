import assert from "power-assert";
import createValidator from "../src/codemirror-textlint";
describe("codemirror-textlint", function () {
    it("should return lint function", function (done) {
        const actualText = "test text";
        const validator = createValidator({
            rules: {
                "example-rule": function (context) {
                    let {Syntax,getSource, report,RuleError} = context;
                    return {
                        [Syntax.Document](node){
                            const text = getSource(node);
                            assert.equal(text, actualText);
                            report(node, new RuleError("message"));
                        }
                    }
                }
            }
        });
        validator(actualText, (results) => {
            assert.equal(results.length, 1);
            var result = results[0];
            assert.equal(result.message, "message");
            assert.deepEqual(result.from, {line: 0, ch: 0});
            done();
        });
    });
});