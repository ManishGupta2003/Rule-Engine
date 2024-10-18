# Rule Engine Application

This is a simple 3-tier rule engine application that determines user eligibility based on attributes like age, department, income, and spend. The application uses an Abstract Syntax Tree (AST) to represent conditional rules, allowing for dynamic creation, combination, and modification of these rules.



## Demo




https://github.com/user-attachments/assets/6e31cc0e-396a-4383-98d7-a391d7177f75




## Features

- Create and store rules in a MongoDB database.
- Combine multiple rules into a single AST.
- Evaluate rules against user data.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- React
- Tailwind CSS

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (installed locally or use a cloud instance)

### Clone the Repository

```bash
git clone https://github.com/yourusername/rule-engine.git
cd rule-engine


Install server dependencies:

Navigate to the server folder and run:

bash
Copy code
cd server
npm install
Install client dependencies:

Navigate to the client folder and run:

bash
Copy code
cd client
npm install
Set up MongoDB:

Make sure you have MongoDB installed and running on your local machine. The default connection URL is mongodb://localhost:27017/ruleengine.

Start the server:

bash
Copy code
cd server
npm start
Start the client:

In a new terminal window, navigate to the client folder and run:

bash
Copy code
cd client
npm start
Usage
Open your browser and navigate to http://localhost:3000 to access the Rule Engine Application.
Follow the prompts to create and evaluate rules.
API Endpoints
POST /create_rule

Request Body: { "rule_name": "string", "ruleString": "string" }
Description: Create and store a new rule in MongoDB.
POST /combine_rules

Request Body: { "ruleStrings": ["string1", "string2", ...] }
Description: Combine multiple rules into a single AST.
POST /evaluate_rule

Request Body: { "ast": "AST object", "data": { "attribute": "value", ... } }
Description: Evaluate a rule (AST) against provided data.
Contributing
Contributions are welcome! Please create a pull request or open an issue for any changes or improvements.



