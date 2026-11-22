# OpenPulse

OpenPulse is an independent open-source discovery project. It presents public GitHub repository metadata in a searchable interface.

## Current features
- Displays the latest repository snapshot from the GitHub API.
- Search by repository name and description.
- Filter by programming language.
- Sort by stars, forks, or name.
- Shows source links and collection timestamp.

## Data
The website reads `data/latest.json`. The current dataset is a snapshot of repositories returned by a GitHub repository search. It is **not** a real-time trending feed and does not yet calculate growth over time.

## Run locally
Serve this directory with any static web server, for example:
`python -m http.server 8000`
Then open http://localhost:8000.

## Attribution
Repository metadata is sourced from the GitHub public API. Project names, descriptions, metrics and trademarks belong to their respective owners. OpenPulse is independent and is not affiliated with GitHub.

## Status
Early prototype. Historical tracking, methodology documentation, privacy information and production deployment are planned.


## OpenPulse automation (n8n)

The `automation/` directory contains importable n8n workflow JSON files for the local content engine.

### Local AI model
The editorial and content-generation workflows use Ollama with `qwen2.5-coder:7b`.

Ollama endpoint: `http://127.0.0.1:11434/api/generate`

Before running, confirm Ollama is running and the model is installed:
```powershell
ollama list
ollama run qwen2.5-coder:7b
```

### Importing workflows
In n8n, choose **Workflows → Import from File** and select a JSON file from `automation/`. Keep workflows inactive until tested.

- `OP-02_Editorial_Intelligence_Qwen25.json`: scores and categorizes a topic received by webhook.
- `OP-03_Content_Studio_Qwen25.json`: drafts a research brief, article, long-video script, three short-video scripts, social posts and a discussion prompt.

These workflows are local automation foundations, not direct social publishers. Fact-check AI output and obtain human approval before publication. If n8n runs in Docker or on another machine, replace `127.0.0.1` with an Ollama host address reachable from n8n.
