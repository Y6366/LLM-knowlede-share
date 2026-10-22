## I. Summary:
This proposal is intended for enterprise development assistance scenarios. Through comprehensive evaluation, it aims to select large models with strong coding capabilities, good business adaptability, and controllable deployment and usage costs, to support private deployment within the enterprise and developers' daily business development.

The evaluation covers five dimensions: generating standalone functions from requirements, completing project code based on context, one-time fixing of already-located erroneous functions, generating cross-file patches under a fixed context, and the ability to implement real requirements. Among them, standalone function generation and real requirement implementation have a broader task scope; self-built datasets struggle to balance coverage, difficulty distribution, and consistency of acceptance criteria, so public datasets are used for evaluation. The other three dimensions are based on the existing business evaluation process, measuring the model's adaptability to the internal tech stack and project context.

By splitting and classifying tasks from PRs already merged into business repositories, determining the weight of each corresponding dimension by the proportion of each task type, and weighted-summing the normalized evaluation scores, and combining deployment resources, inference performance, and operating costs, a quantitative basis for model selection is provided.

Currently, a total of 20 related code repositories under the ETIV-core-ai-platform repository are counted, matching 7,136 PRs.

## II. Evaluation Dimension Breakdown:
* Generating standalone functions from requirements
* Completing project code based on context
* One-time fixing of already-located erroneous functions
* Generating cross-file patches under a fixed context
* And the ability to implement real requirements

## III. Business Flow Logic
* Classify the types of PRs already submitted to each existing business repository.
* For different types of PRs, classify the task types required to use the model's code generation capability.
* Calculate the proportion of task types involved in each PR type out of the total, obtaining the weight percentage of each task type.
* Evaluate each model based on the weight of each task type, and obtain a total score through weighted scoring.
* Rank by total score to obtain the model capability ranking.

## IV. Existing Business Data by Task Type

| Task Type          | Number of PRs Involved | Share of All PRs  |
| ------------- | ----- | ------ |
| Generating standalone functions from requirements     | 822   | 8.76%  |
| Completing project code based on context   | 4,448 | 47.41% |
| One-time fixing of already-located erroneous functions | 127   | 1.35%  |
| Generating cross-file patches under a fixed context | 2,832 | 30.19% |
| Ability to implement real requirements      | 1,153 | 12.29% |
| Total            | 9,382 | 100%   |
Note: A total of 7,136 PRs are counted. PRs and task types are a one-to-many match, and the task type corresponding to a PR may be empty. If a PR is of a special type and its task type cannot be determined, the task type is empty and is not included in the current statistical scope.

## V. Description of Task Evaluation Methods
### 1. Generating Standalone Functions from Requirements
**Description**: Standalone function generation mainly measures general programming and logical reasoning ability, with lower dependence on enterprise-specific context. Public datasets provide standardized problems, executable tests, and a unified scoring mechanism, which can reduce the cost of problem setting and acceptance while improving the comparability of evaluation results, so it is recommended to use them first.

**Recommended evaluation method: Humaneval**

Basic HumanEval task: **Provide the model with a Python function signature and functional description, require the model to complete the function implementation, and then determine correctness through test cases.**

**Sample problem:**
```
def has_close_elements(numbers: list[float], threshold: float) -> bool:
    """
    Determine whether there are two elements at different positions in the list
    whose absolute difference is less than threshold.

    >>> has_close_elements([1.0, 2.0, 3.0], 0.5)
    False
    >>> has_close_elements([1.0, 2.0, 3.0], 1.1)
    True
    """
```
**Sample model generation:**
```
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if abs(numbers[i] - numbers[j]) < threshold:
                return True
    return False
```
**Score calculation logic:**
**pass@k**: **The probability that at least one of the k candidate answers generated for each problem is correct.**

**Problem scoring logic:**
Each problem provides multiple related test cases. Each generated answer must pass all tests for that problem to be considered correct; partial credit is not given based on the proportion of tests passed.
Example:

| Execution Result         | Score for That Answer |
| ------------ | ------ |
| All assertions pass       | 1      |
| Any assertion fails       | 0      |
| Syntax error, runtime exception, or timeout | 0      |

### 2. Ability to Implement Real Requirements
**Description**: Real requirement implementation involves diverse business logic, cross-module dependencies, and complex acceptance conditions. The existing business code evaluation logic has high costs in requirement restoration, environment reproduction, and acceptance criteria construction, and its accuracy is difficult to control. Giving priority to public datasets with complete engineering environments and executable acceptance mechanisms can reduce construction costs and improve the reproducibility of evaluation and comparability across models.

**Recommended evaluation method: bigcodebench**

**BigCodeBench is a large-model code generation benchmark for practical programming tasks**, focusing on the model's ability to understand complex requirements, call third-party libraries, and generate executable code.

**Basic HumanEval task:**
The basic task of BigCodeBench is to generate a Python function that correctly calls third-party libraries, completes the specified functionality, and passes the accompanying tests, based on natural language requirements or function documentation.

**Sample problem:**
```
def task_func(csv_path, output_path):
    """
    Read a CSV file containing two columns, department and salary.

    Requirements:
    1. Remove records with missing salary.
    2. Calculate the average salary by department.
    3. Sort by average salary from high to low.
    4. Generate a bar chart and save it to output_path.
    5. Return the sorted statistical results.
    """
    pass
```

This type of task requires the model to handle simultaneously:
- Data reading and cleaning;
- Correct use of library functions and parameters;
- Data linkage between multiple steps;
- Interface constraints such as return values and file artifacts.

**Score calculation logic:**
During evaluation, the corresponding prompt is input into the model to obtain code, and then tests are run in an execution environment with dependencies prepared. **Scoring is based on functional tests; the code text is not required to match the reference implementation.**

**Problem scoring logic**:
BigCodeBench runs the accompanying tests for each problem. If the generated code passes all tests, it is recorded as a success; otherwise, it is recorded as a failure, and overall performance is summarized with metrics such as pass@1.

**Humaneval vs Bigcodebench:**

| Comparison Dimension  | Humaneval     | BigCodebench   |
| ----- | ------------- | -------------- |
| Problem scale  | 164 problems         | 1,140 problems        |
| Typical content  | Basic algorithms, strings, list operations | Data processing, library calls, task automation |
| Requirement complexity | Usually relatively short         | More steps and interface constraints      |
| Core capability  | Logical implementation of standalone functions     | Requirement understanding and library API combination  |

### 3. Completing Project Code Based on Context, One-Time Fixing of Already-Located Erroneous Functions, Generating Cross-File Patches Under a Fixed Context

All three dimensions above are highly dependent on the enterprise's internal business logic, interface conventions, code standards, and module dependencies, and public datasets cannot fully reflect actual development constraints. Based on the existing evaluation process for enterprise business, real code context, historical defects, and cross-file changes can be used to evaluate the model's project adaptability and modification correctness, making evaluation results closer to enterprise development needs.

## VI. Other
**1. Future business optimization direction:**
For the three evaluation dimensions of completing project code based on context, one-time fixing of already-located erroneous functions, and generating cross-file patches under a fixed context, clean the content based on existing PRs and build private datasets to evaluate model capabilities.

2. **Mainstream evaluation forms for coding capability**

| Scoring Form     | In What Form the Acceptance Basis Exists       | Main Measurement             |
| -------- | ----------------- | ---------------- |
| Execution tests     | Test code, input and expected output, test environment | Whether functionality meets requirements         |
| Code text matching   | Reference code, matching rules         | Whether completion is consistent with the original code      |
| Identifier matching    | Identifiers such as variables and functions in the reference code   | Whether the expected project symbols are used     |
| Code structure matching   | Reference code and its syntax tree, data flow     | Degree of structural similarity between generated code and reference implementation |
| Performance and complexity evaluation | Inputs of different scales, timing and memory measurement programs | Time, space efficiency, and complexity requirements    |
| Human/model review  | Scoring rubric, requirement description, review prompts   | Readability, design reasonableness, requirement compliance, etc. |
