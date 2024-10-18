import React, { useState } from "react";
import axios from "axios";

function App() {
  const [ruleName, setRuleName] = useState("");
  const [ruleString, setRuleString] = useState("");
  const [ruleStrings, setRuleStrings] = useState([""]);
  const [combinedAST, setCombinedAST] = useState(null);
  const [data, setData] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);

  const createRule = async () => {
    try {
      const response = await axios.post("http://localhost:5000/create_rule", {
        rule_name: ruleName,
        ruleString,
      });
      alert("Rule created successfully!");
      console.log(response.data.ast);
    } catch (error) {
      alert("Error creating rule: " + error.response.data.error);
    }
  };

  const combineRules = async () => {
    try {
      const response = await axios.post("http://localhost:5000/combine_rules", {
        ruleStrings,
      });
      setCombinedAST(response.data.combinedAst);
      alert("Rules combined successfully!");
    } catch (error) {
      alert("Error combining rules: " + error.response.data.error);
    }
  };

  const evaluateRule = async () => {
    try {
      const response = await axios.post("http://localhost:5000/evaluate_rule", {
        ast: combinedAST,
        data,
      });
      setEvaluationResult(response.data.result);
    } catch (error) {
      alert("Error evaluating rule: " + error.response.data.error);
    }
  };

  const handleRuleStringChange = (index, value) => {
    const newRuleStrings = [...ruleStrings];
    newRuleStrings[index] = value;
    setRuleStrings(newRuleStrings);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-700">
          Rule Engine Application
        </h1>

        <div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Create a New Rule
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Rule Name"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Rule String (e.g. age > 30 AND department = 'Sales')"
              value={ruleString}
              onChange={(e) => setRuleString(e.target.value)}
              className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createRule}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Create Rule
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Combine Multiple Rules
          </h2>
          {ruleStrings.map((rule, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                placeholder="Rule String"
                value={rule}
                onChange={(e) => handleRuleStringChange(index, e.target.value)}
                className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="mt-4 space-x-2">
            <button
              onClick={() => setRuleStrings([...ruleStrings, ""])}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Add Another Rule
            </button>
            <button
              onClick={combineRules}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Combine Rules
            </button>
          </div>

          {combinedAST && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700">
                Combined AST:
              </h3>
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(combinedAST, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Evaluate Rule
          </h2>
          <textarea
            rows="5"
            placeholder='Provide JSON data (e.g. {"age": 35, "department": "Sales", "salary": 60000, "experience": 3})'
            onChange={(e) => setData(JSON.parse(e.target.value))}
            className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={evaluateRule}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Evaluate Rule
          </button>

          {evaluationResult !== null && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Evaluation Result:
              </h3>
              <p
                className={`text-lg font-bold ${
                  evaluationResult ? "text-green-600" : "text-red-600"
                }`}
              >
                {evaluationResult ? "True" : "False"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
