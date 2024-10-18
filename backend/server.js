const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/ruleengine")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const ruleSchema = new mongoose.Schema({
  rule_name: { type: String, required: true },
  ast: { type: Object, required: true },
});
const Rule = mongoose.model("Rule", ruleSchema);

function parseRule(ruleString) {
  ruleString = ruleString.trim();
  let andIndex = ruleString.lastIndexOf(" AND ");
  let orIndex = ruleString.lastIndexOf(" OR ");

  if (andIndex !== -1) {
    const leftPart = ruleString.substring(0, andIndex).trim();
    const rightPart = ruleString.substring(andIndex + 5).trim();
    return {
      type: "AND",
      left: parseRule(leftPart),
      right: parseRule(rightPart),
    };
  } else if (orIndex !== -1) {
    const leftPart = ruleString.substring(0, orIndex).trim();
    const rightPart = ruleString.substring(orIndex + 4).trim();
    return {
      type: "OR",
      left: parseRule(leftPart),
      right: parseRule(rightPart),
    };
  } else {
    const match = ruleString.match(/(\w+)\s*([><=]+)\s*(\d+|\'.+?\'|\w+)/);
    if (match) {
      const [_, attribute, operator, value] = match;
      return {
        type: "operand",
        value: {
          attribute,
          operator,
          value: isNaN(value) ? value : Number(value),
        },
      };
    } else {
      throw new Error("Invalid rule string");
    }
  }
}

function combineRules(rules) {
  if (rules.length === 0) return null;

  let combinedAst = parseRule(rules[0]);

  for (let i = 1; i < rules.length; i++) {
    const nextAst = parseRule(rules[i]);
    combinedAst = {
      type: "AND",
      left: combinedAst,
      right: nextAst,
    };
  }

  return combinedAst;
}

function evaluateRule(ast, data) {
  if (ast.type === "operand") {
    const { attribute, operator, value } = ast.value;
    const actualValue = data[attribute];

    switch (operator) {
      case ">":
        return actualValue > value;
      case "<":
        return actualValue < value;
      case "=":
        return actualValue === value;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  } else if (ast.type === "AND") {
    return evaluateRule(ast.left, data) && evaluateRule(ast.right, data);
  } else if (ast.type === "OR") {
    return evaluateRule(ast.left, data) || evaluateRule(ast.right, data);
  } else {
    throw new Error(`Unknown AST node type: ${ast.type}`);
  }
}

app.post("/create_rule", async (req, res) => {
  const { rule_name, ruleString } = req.body;
  try {
    const ast = parseRule(ruleString);
    const newRule = new Rule({ rule_name, ast });
    await newRule.save();
    res.status(200).json({ message: "Rule created successfully", ast });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/combine_rules", (req, res) => {
  const { ruleStrings } = req.body;
  try {
    const combinedAst = combineRules(ruleStrings);
    res.status(200).json({ combinedAst });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/evaluate_rule", (req, res) => {
  const { ast, data } = req.body;
  try {
    const result = evaluateRule(ast, data);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
