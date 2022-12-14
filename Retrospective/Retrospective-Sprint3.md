TEMPLATE FOR RETROSPECTIVE (Team 7)
=====================================

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: **2/2**
- Total points committed vs done: **13/13**
- Nr of hours planned vs spent (as a team): **72h / 72h 45m**

**Definition of Done:**

- Unit Tests passing: **yes**
- Code review completed: **yes**
- Code present on VCS: **yes**
- End-to-End tests performed: **yes**

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 15      | -      | 47h        | 47h 30m      |
| HT-8  | 8       | 5      | 15h        | 15h          |
| HT-9  | 6       | 8      | 10h        | 10h 15m      |

- Hours per task (average, standard deviation):

  - Average
    - estimated: ** ~ 2h 29m**
    - actual: ** ~ 2h 30m**
  - Standard Deviation
    - estimated: **~ 1.03**
    - actual: **~ 1.29**

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1

  1 - (72h / 72h 45m) = 1 - 0.99 = 0.01 = **1%**
  
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: **3h**
  - Total hours spent: **3h 10m**
  - Nr of automated unit test cases: **38**
  - Coverage (if available): **80.3 %**
- E2E testing:
  - Total hours estimated: **3h**
  - Total hours spent: **3h 30m**
- Code review 
  - Total hours estimated: **1h**
  - Total hours spent: **55m**
- Technical Debt management:
  - Total hours estimated: **8h**
  - Total hours spent: **8h 25m**
  - Hours estimated for remediation by SonarQube: **31h**
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: **31h** 
  - Hours spent on remediation: **8h 25m** 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): **0.0 %**
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability):
    - Reliability: **A**
    - Security: **A**
    - Maintanability: **A**
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

  - *Underestimation of time needed to improve/fix previous code due to cascading of needed updates*
  - *Set up of SonarCloud and correct linking with GitHub took more time than expected*
  - *Time assigned to design tasks (API Definition, GUI mock-up) was more than needed at this stage of development*

- What lessons did you learn (both positive and negative) in this sprint?

  - *Handling Technical Debt since the beginning of the Sprint repays in terms of efficiency*

- Which improvement goals set in the previous retrospective were you able to achieve? 

  - *Initial planning was (finally!) shortened to 2h 30m*

  - *We were able to do a better management of technical debt thanks to SonarCloud*

- Which ones you were not able to achieve? Why?

  -

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - *Try to be flexible in managing changes*
  - *Try to complete the development at least 2 days before the end of the Sprint and use those two days only for refinements and tests*
  - *Try to define shorter tasks*

- One thing you are proud of as a Team!!
  - *Still zero fights (almost...)* (╯°□°）╯︵ ┻━┻
