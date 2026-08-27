# Event source adapters

Batch 2 uses source adapters so every provider is normalized into the same NEONDO event shape before persistence.

## First source: visitBerlin

The official visitBerlin calendar is the initial source target. It covers concerts, nightlife, exhibitions, theatre, festivals, sports and other Berlin events.

The adapter intentionally does not scrape or bypass protections. When an official machine-readable feed/API or permitted export is available, its records should be passed through `normalizeVisitBerlinEvent()`.

Source: https://www.visitberlin.de/en/event-calendar-berlin
