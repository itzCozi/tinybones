---
title: "Building a Series: Part 2"
description: "Usage guidelines and retrofitting existing posts into a series."
publicationDate: 2025-11-16
tags:
  - Series
authors:
  - BadDeveloper
series: building-a-series
seriesIndex: 2
---

# Building a Series: Part 2

Welcome back! This second part explores how to use the new **post series** feature effectively.

## Tips

**Keep slugs stable:** Pick a concise, permanent slug (`building-a-series`).

**Number sequentially:** Use `seriesIndex` starting at 1. Skip numbers only if you intentionally remove an entry.

**Provide context:** In each part, briefly recap prior entries and link forward/backward.

## Retrofitting Older Posts

When grouping existing posts:

- Add matching `series` slugs to their frontmatter.
- Assign `seriesIndex` in logical reading order (not necessarily publication date).
- Optionally update descriptions to clarify how each part fits.

