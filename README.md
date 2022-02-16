# Project Laboratory (Önálló laboratórium)

## Initial domain-level project plan

---

## Subsystems

### Authentication

Allows site visitors, API users to log in using [OAuth 2.0](https://oauth.net/2/). This subsystem provides login details for the _User management subsystem_. Stores session data.

### User management

Stores user data and allows other systems to access it.

### Authorization

Allows the creation and assignment of roles. These roles allow or prohibit the use of services.

### Challenge administration

Responsible for handling Challenges. Challenges have a description, example inputs and outputs. 

Not every user is allowed to create challenges, and only the creator of a challenge is allowed to edit or delete it. Every user should see all challenges.

### Solution submission

Responsible for handling Solutions. Challenges can have solutions submitted to them. These solutions are source codes of a solution that solves a challenge. Solutions recieve feedback by the _Evaluator subsystem_.

Every user can upload solutions to any challenge (even their own), but only the owner of a solution can edit or delete it. Only the solution and challenge owners can see the solution and the recieved feedback.

### Solution evaluator

Provides a way for challenge owners to check if a given _Solution_ is correct and evaluates all _Solutions_. Gives feedback on _Solutions_ (memory, cpu usage, which inputs produce incorrect outputs, etc.).

### Comment administration

Comments can be appended to _Challenges_ or _Solutions_. Comments have a creation date and an owner. They can be deleted or edited by the owner at any time.