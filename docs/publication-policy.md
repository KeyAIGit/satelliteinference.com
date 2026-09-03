# Public document publication policy

Version: 1.0
Effective: 2026-09-03

## Purpose

Satellite Inference publishes selected concept documents so technical and commercial claims can be inspected against an explicit evidence boundary. Publication does not convert a planning assumption into flight-release data.

## Release classes

The current public site permits one release status:

- `CONCEPT_DOCUMENT`: early planning material that may contain calculations, targets, or assumptions requiring customer, supplier, test, regulatory, or launch-provider evidence.

No document may be described as flight qualified, supplier accepted, launch compatible, customer validated, or contractually available without the underlying record and a separate release review.

## Integrity record

Each public PDF must have a manifest entry containing:

- stable document ID;
- exact filename and root-safe public URL;
- title, version, status, and publication date;
- exact page count and byte size;
- SHA-256 digest;
- an explicit concept-document disclaimer.

Automated tests fail when a file is missing, metadata does not match the bytes, a path is unsafe, an ID is duplicated, a status is unknown, or the disclaimer is absent.

## Revision rule

A substantive edit creates a new versioned file and a new manifest entry or intentionally replaces the prior entry as part of a reviewed release. Published hashes are never silently updated to conceal an unexplained file change.

## Exclusions

Private supplier responses, prices, export classifications, personal contact details, customer correspondence, investor diligence, non-public internal budgets or deliberative forecasts, and security-sensitive technical information do not belong in the public package.
