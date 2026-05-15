# Contributing

Thanks for helping improve Mike. Please keep contributions small, focused, and easy to review.

## Guidelines

- Prefer targeted edits over broad refactors.
- Keep each PR focused on one bug, feature, or cleanup.
- Update docs or env examples when changing setup, config, or user-facing behavior.
- Please do not propose local-hosting refactors for the main app, such as local LLMs, local databases, or local filesystem storage. Those ideas are better suited to a future fully local version of the project.
- Do not commit secrets, API keys, private documents, or local `.env` files.

## Before Opening a PR

- Run the relevant build or test command for the area you changed.
- Check `git diff` and remove unrelated changes.
- Write a concise Markdown PR description with:
    - summary
    - changes
    - why
    - testing

## Local Development

Backend:

```bash
npm run build --prefix backend
```

Frontend:

```bash
npm run build --prefix frontend
```
