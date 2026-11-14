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
