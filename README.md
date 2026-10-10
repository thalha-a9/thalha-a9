<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-light.svg">
  <img src="assets/hero-light.svg" alt="Thalha Ahmed — developer and security researcher. I build high-performance, local-first CLI tools, automation scripts, and advanced OSINT frameworks." width="100%">
</picture>

<p align="center">
  <a href="#about">About</a> &nbsp;·&nbsp;
  <a href="#selected-work">Selected Work</a> &nbsp;·&nbsp;
  <a href="#specializations">Specializations</a> &nbsp;·&nbsp;
  <a href="#how-i-work">How I Work</a> &nbsp;·&nbsp;
  <a href="#writing">Writing</a> &nbsp;·&nbsp;
  <a href="#contact">Contact</a>
</p>

<br>

## About

I'm **Thalha Ahmed** — a developer and security researcher. I build **high-performance, local-first CLI tools, automation scripts, and advanced OSINT frameworks.**

My work sits where reconnaissance meets engineering: asynchronous OSINT frameworks, network security tooling, and the automation that ties them together — all of it **built to eliminate false positives**.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/code-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/code-light.svg">
  <img src="assets/code-light.svg" alt="helix --map-identity --deep — resolving surfaces, extracting bio-linked profiles, verifying via native email checks; identity graph resolved with zero false positives" width="100%">
</picture>

<br>

## Selected Work

<a href="https://github.com/thalha-a9/helix">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/project-helix-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/project-helix-light.svg">
    <img src="assets/project-helix-light.svg" alt="Helix — OSINT identity mapping, built to eliminate false positives" width="100%">
  </picture>
</a>

**Helix** is an asynchronous OSINT identity mapping tool engineered to track digital footprints, extract bio-linked profiles, and correlate targets with native email verification.

**The problem.** Most username-enumeration tooling optimises for coverage and pays for it in noise — a wall of "hits" you then have to disprove by hand.

**The approach.** Verification is a first-class stage, not post-processing. Surfaces resolve concurrently, bio-linked profiles are extracted and cross-referenced, and native email verification confirms or rejects each correlation *before* it reaches the report.

| Capability | What it means |
|:--|:--|
| **Async by design** | Concurrent resolution across surfaces, not serial request chains |
| **Correlation, not collection** | Builds an identity graph — links between findings, not a flat list |
| **Native verification** | Email verification confirms matches in-pipeline |
| **False positives eliminated** | Rejected candidates are dropped before output, not left for you to triage |

<div align="right"><a href="https://github.com/thalha-a9/helix"><b>View the repository →</b></a></div>

<br>

<a href="https://github.com/thalha-a9/git-mistake">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/project-git-mistake-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/project-git-mistake-light.svg">
    <img src="assets/project-git-mistake-light.svg" alt="git-mistake — recover lost commits and undo catastrophic git mistakes, safely" width="100%">
  </picture>
</a>

**git-mistake** is an interactive CLI companion designed to safely navigate detached HEAD states, recover lost commits, and undo catastrophic git mistakes.

**The problem.** Git's recovery primitives are complete but unforgiving. In the exact moment you need `reflog` most — commits missing, HEAD detached, a hard reset you regret — the recovery path is the hardest to find.

**The approach.** Rather than requiring you to already know the command, `git-mistake` starts from the symptom. You describe what went wrong in plain language; it maps that to a recovery path, states what it's about to do, and keeps you clear of operations that would make things worse.

| Design choice | What it means |
|:--|:--|
| **Symptom-first** | Ask "what went wrong", not "which plumbing command do you need" |
| **Non-destructive** | Recovery paths that don't compound the original mistake |
| **Explains itself** | Every action is stated before it runs — you learn the escape route |
| **Built for the bad day** | Designed for the moment you're panicking, not the moment you're reading docs |

<div align="right"><a href="https://github.com/thalha-a9/git-mistake"><b>View the repository →</b></a></div>

<br>

## Specializations

<table>
<tr>
<td width="50%">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/card-netsec-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/card-netsec-light.svg">
  <img src="assets/card-netsec-light.svg" alt="Network Security — traffic and protocol analysis, service exposure mapping and hardening review" width="100%">
</picture>
</td>
<td width="50%">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/card-osint-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/card-osint-light.svg">
  <img src="assets/card-osint-light.svg" alt="OSINT Frameworks — identity correlation and footprint mapping, with verification built in" width="100%">
</picture>
</td>
</tr>
<tr>
<td width="50%">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/card-pentest-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/card-pentest-light.svg">
  <img src="assets/card-pentest-light.svg" alt="Penetration Testing — recon, enumeration, exploitation and privilege escalation; scoped work" width="100%">
</picture>
</td>
<td width="50%">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/card-automation-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/card-automation-light.svg">
  <img src="assets/card-automation-light.svg" alt="Automation — scheduled and event-driven pipelines that run unattended and retry safely" width="100%">
</picture>
</td>
</tr>
</table>

| | Discipline | Applied to |
|:-:|:--|:--|
| `01` | **Network Security** | Traffic and protocol analysis, service exposure mapping, hardening and configuration review |
| `02` | **OSINT Frameworks** | Identity correlation, footprint mapping, source verification, structured intelligence output |
| `03` | **Penetration Testing** | Reconnaissance, enumeration, exploitation and privilege escalation — scoped and authorized |
| `04` | **Automation** | Scheduled and event-driven pipelines, idempotent and retry-safe, built to run unattended |

> **On offensive work:** everything under `03` happens only within an agreed scope, with authorization, and is reported to the owner of the system. Tooling I publish is built for defenders, researchers, and authorized engagements.

<br>

## How I Work

**Local-first.** Tools run on your machine. No mandatory cloud round-trip, no telemetry, no third-party service that can rate-limit you mid-engagement or quietly log your targets.

**Verified output, or none.** Verification runs in-pipeline and rejected candidates are dropped before they reach you — built to eliminate false positives, not to hand you a list to disprove.

**Async where it counts.** Reconnaissance is I/O-bound. Concurrency is the difference between a tool you use and a tool you wait for.

**Automate the second occurrence.** If a task happens twice it gets a script; if it happens on a schedule it gets a tool — idempotent, retry-safe, logged.

**The bad day is the design target.** Tooling should be at its clearest when the person using it is at their most stressed.

<br>

## Writing

Technical deep-dives, tool architecture breakdowns, and cybersecurity research — the reasoning behind the tools above, written out in full.

<div align="center">
  <h3><a href="https://helix-osint.hashnode.dev">Helix OSINT Labs →</a></h3>
</div>

<br>

## Contact

Open to conversations about security tooling, OSINT engineering, and collaboration on either project above.

| | |
|:--|:--|
| **GitHub** | [github.com/thalha-a9](https://github.com/thalha-a9) |
| **Writing** | [helix-osint.hashnode.dev](https://helix-osint.hashnode.dev) |

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/footer-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/footer-light.svg">
  <img src="assets/footer-light.svg" alt="local-first · no telemetry · no third-party services" width="100%">
</picture>

<p align="center">
  <sub>Every graphic on this page is generated from <a href="tools/">/tools</a> and verified in CI — type outlined with opentype.js, dark and light themes rendered from one scene, no webfonts, no badge services, no CDNs. It adapts to your GitHub theme.</sub>
</p>
