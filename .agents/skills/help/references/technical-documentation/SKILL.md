---
name: technical-documentation
description: Create, restructure, review, or improve technical documentation by matching tutorials, how-to guides, reference, and explanation to distinct user needs. Use for documentation strategy, information architecture, doc-type classification, doc audits, onboarding guides, task guides, API or reference docs, conceptual explanations, and mixed technical documentation that needs separation.
metadata:
  internal: true
---

# Technical Documentation

Make each document serve one user need. Classify by what the user is doing now, not by the subject, format, difficulty, or product structure.

## Classify the need

Ask two questions:

1. Does the user need **action** or **cognition**?
2. Are they **acquiring** skill through study or **applying** skill at work?

| User need | Document type | Purpose |
| --- | --- | --- |
| Action + acquisition | Tutorial | Learn through a guided experience |
| Action + application | How-to guide | Accomplish a real task |
| Cognition + application | Reference | Look up authoritative facts while working |
| Cognition + acquisition | Explanation | Build understanding through reflection |

Use this compass at document, section, paragraph, or sentence level. If content serves several cells, split it and cross-link the parts rather than weakening each purpose. ([The compass](references/compass.md), [Foundations](references/foundations.md), [The map](references/map.md))

Do not confuse beginner with tutorial or advanced with how-to. The distinction is study versus work: a competent user can need a basic how-to, while an advanced learner can need a tutorial. ([Tutorials and how-to guides](references/tutorials-how-to.md))

## Method

1. **Name the user and moment.** State what the reader is trying to learn, accomplish, look up, or understand. Choose one primary document type with the compass.
2. **Ground the facts.** Identify the version and authoritative sources: code, schemas, interfaces, commands, runtime behavior, specifications, and product decisions. Resolve contradictions before writing.
3. **Set the boundary.** Define the outcome, task, machinery, or topic covered. List adjacent material that belongs in another document and will be linked.
4. **Write by type.** Apply only the matching contract below. Preserve useful mixed content by moving it to the right document.
5. **Connect the set.** Add links where the reader naturally changes need: tutorial to explanation, how-to to reference, reference to task guidance, and explanation to practical material.
6. **Prove the document.** Exercise action-oriented documentation exactly as written. Check cognition-oriented documentation against its sources. Then review the reader's flow.
7. **Publish the smallest complete improvement.** Improve documentation from the inside out instead of creating empty top-level buckets or waiting for a wholesale reorganization. ([Applying Diátaxis](references/application.md), [Workflow](references/how-to-use-diataxis.md))

## Tutorial contract

Create a controlled, meaningful learning experience in which the learner succeeds by doing.

- Show the concrete result the learner will build; state prerequisites and provide a known-good starting state.
- Lead one reliable path in small steps. Remove choices, alternatives, abstraction, and nonessential explanation.
- Produce a visible, comprehensible result at every useful step. Show expected output and point out what the learner should notice.
- Make the journey end-to-end and usefully complete. Permit repetition where it reinforces the skill.
- Use direct instructions and an inclusive tutor voice: “First, do…”, “The output should…”, “Notice that…”, “We have built…”.
- Verify in a fresh environment by following only the tutorial. Every promised result must occur.

The teacher owns the learner's successful experience; confidence depends on reliability. ([Tutorials](references/tutorials.md))

## How-to guide contract

Guide an already-competent user through a real task or problem.

- Title it `How to <achieve a specific result>` and state the goal from the user's perspective.
- Start and end at meaningful points. Include only the actions and decisions needed for this task.
- Order steps by dependency and the user's natural flow. Avoid needless context switches and unresolved thoughts.
- Address real-world variation with conditional instructions: “If you want x, do y.” Let the user adapt the guidance.
- Verify that the documented sequence achieves the stated result in a representative real situation.

Practical usability matters more than exhaustive coverage. ([How-to guides](references/how-to-guides.md))

## Reference contract

Describe the machinery truthfully so a working user can consult it with certainty.

- Mirror the product's logical structure and use one predictable template for equivalent entities.
- State facts neutrally and precisely: behavior, syntax, parameters, types, defaults, return values, state, limits, warnings, and errors.
- Cover the declared scope completely. Generate material from authoritative sources when that improves fidelity, then review the result.
- Include concise examples that illustrate usage without turning into instruction or explanation.
- Verify every factual claim against the named version's source or observed behavior.

Reference should be austere, consistent, and easy to scan rather than read linearly. ([Reference](references/reference.md))

## Explanation contract

Help a reader understand a bounded topic away from the pressure of an immediate task.

- Start from a real `why` question or define a clear conceptual boundary.
- Connect concepts; provide background, causes, constraints, implications, history, and design rationale.
- Consider alternatives, counterexamples, opinions, and perspectives when they clarify the subject.
- Use examples and analogies to deepen understanding, not to create a procedure.
- Verify technical premises and make judgments, uncertainty, and perspective explicit.

Explanation can be discursive, but it must remain bounded. ([Explanation](references/explanation.md), [Reference and explanation](references/reference-explanation.md))

## Quality check

First establish functional quality:

- **Accurate:** claims match the named source and version.
- **Complete:** the promised scope has no material gaps.
- **Consistent:** terminology, structure, examples, and cross-links agree.
- **Useful and precise:** the intended user can satisfy the stated need without guessing.

Then judge deep quality: Does the document fit the reader's situation, preserve flow, anticipate the next need, and feel coherent to use? Diátaxis helps expose functional defects and improve fit and flow, but it does not replace technical verification or editorial judgment. ([Quality](references/quality.md))

## Output

Deliver the requested document or revision with:

- one explicit user need and primary type;
- scope and version where relevant;
- evidence appropriate to the type: successful walkthrough, task completion, source comparison, or premise review.

For an audit, classify each finding by document type, cite the conflicting passage, name the user need it obstructs, and propose the smallest move, deletion, or rewrite that restores one clear purpose.

## Attribution

Adapted from [Diátaxis](references/index.md) by Daniele Procida. The extracted source archive and this adaptation are available under [CC BY-SA 4.0](references/SOURCES.md).
