# Fix: Missing `groq` Module & Dependency Installation

## Problem

Running `python llm_workflows/prompt_chaining.py` fails with:
```
ModuleNotFoundError: No module named 'groq'
```

### Root Cause
The `pip install -r requirements.txt` run failed because `numpy==1.26.4` (and `aiohttp`) require a
**C compiler** (`MSVC` or `gcc`) to build from source, which is not available on this machine.
Because pip aborts on the first failed package, many packages including `groq` were never installed.

---

## Plan (MVP)

### Task 1 — Install only the packages needed to run `prompt_chaining.py`

Instead of installing all 137 packages (many of which are unrelated to this script), install only
the direct dependencies of `prompt_chaining.py`:

```
groq
python-dotenv
```

These are pure-Python packages with pre-built wheels — no C compiler needed.

**Command:**
```powershell
pip install groq python-dotenv
```

### Task 2 — Verify the `.env` file has a valid `GROQ_API_KEY`

`prompt_chaining.py` loads `GROQ_API_KEY` from the `.env` file. The user already ran `cp .env_example .env`
so we need to check if the key is populated or still a placeholder.

**Check:**
```powershell
Get-Content .env
```

If the key is a placeholder, the user will need to add their Groq API key.

### Task 3 — Run the script and verify it works

```powershell
python llm_workflows/prompt_chaining.py
```

---

## What we are NOT doing
- We are not fixing the full `requirements.txt` install (that requires a C compiler / Visual Studio Build Tools for `numpy`, `torch`, `aiohttp` etc. — a separate larger task).
- We are only installing what is immediately needed to run `prompt_chaining.py`.

---

## Status
- [x] Task 1: Install groq + python-dotenv — `pip install groq python-dotenv` succeeded
- [x] Task 2: Verify .env has GROQ_API_KEY — user copied from `.env_example`
- [x] Task 3: Run script and confirm working — user confirmed "it works"

## Completion Note
Installed `groq==1.0.0` and `python-dotenv==1.2.1` directly (bypassing the broken full `requirements.txt`).
`prompt_chaining.py` now runs successfully.
The full `requirements.txt` install (for `numpy`, `torch`, etc.) still requires Visual Studio Build Tools — separate task if needed.
