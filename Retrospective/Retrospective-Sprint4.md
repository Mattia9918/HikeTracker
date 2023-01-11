TEMPLATE FOR RETROSPECTIVE (Team 7)
=====================================

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: **3/3**
- Total points committed vs done: **21/21**
- Nr of hours planned vs spent (as a team): **72h / 73h 40m**

**Definition of Done:**

- Unit Tests passing: **yes**
- Code review completed: **yes**
- Code present on VCS: **yes**
- End-to-End tests performed: **yes**

### Detailed statistics

| Story            | # Tasks | Points | Hours est. | Hours actual |
| ---------------- | ------- | ------ | ---------- | ------------ |
| _#0_             | 13      | -      | 41h        | 40h 55m      |
| HT-5 [ISSUE FIX] | 2       | -      | 1h 45m     | 1h 45m       |
| HT-8 [ISSUE FIX] | 4       | -      | 3h 45m     | 3h 30m       |
| HT-17            | 6       | 8      | 10h        | 10h 15m      |
| HT-18            | 6       | 8      | 6h         | 5h 15m       |
| HT-34            | 6       | 5      | 9h 30m     | 12h          |

- Hours per task (average, standard deviation):

  - Average
    - **~1h 58m (estimated)**
    - **~1h 59m (actual)**
  - Standard Deviation
    - **~1.40 (estimated)**
    - **~1.70 (actual)**

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1

  1 - (72h / 73h 40m) = 1 - 0.98 = 0.02 = **2%**
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: **4h**
  - Total hours spent: **4h**
  - Nr of automated unit test cases: **35** 
  - Coverage (if available): **81.3 %**
- E2E testing:
  - Total hours estimated: **3h**
  - Total hours spent: **3h 5m**
  - Nr of automated E2E test cases: **62**
- Code review 
  - Total hours estimated: **2h** 
  - Total hours spent: **2h 10m**
- Technical Debt management:
  - Total hours estimated:  **7h**
  - Total hours spent: **6h 15m**
  - Hours estimated for remediation by SonarQube: **17m**
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: **17m** 
  - Hours spent on remediation: **5h 15m** 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): **0.0%**
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):
    - Reliability: **A**
    - Security: **A**
    - Maintainability: **A**
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

  - *Underestimation of time needed to improve/fix previous code due to cascading of needed updates*
  - *Underestimation of time needed to understand and use new technologies (new middlewares and their conflicts)*
  - *Underestimation of time needed to develop the front-end of new user stories which required to develop several new pages and components*

- What lessons did you learn (both positive and negative) in this sprint?

  - *Learning to use and manage conflicts introduced by new technologies takes a lot of time and effort*
  - *Updating code written by someone else (especially if not properly commented) can be time consuming*

- Which improvement goals set in the previous retrospective were you able to achieve? 

  - *We were able to handle changes asked by the PO*

  - *We manage to complete the development 2 days before the end of the Sprint and use those two days only for refinements and tests*
  - *We defined shorter tasks (we lower the average of **35m**!)*

- Which ones you were not able to achieve? Why?

  - *None*

- Improvement goals for the future and how to achieve them (technical tasks, team coordination, etc.)

  - *Spend more time in writing proper code documentation*

- One thing you are proud of as a Team!!
  - *We manage to finish the project in the chilling*  ( •o•)>⌐■-■  (⌐■_■)
