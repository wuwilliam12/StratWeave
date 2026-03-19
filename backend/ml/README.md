# ML Backend Layout

This directory is the starting point for StratWeave's AI / machine learning
work on graph suggestions, strategy scoring, and future predictive systems.

## Intended responsibilities

- `config/` shared ML configuration objects and environment-driven settings
- `data/` dataset loading, parsing, and normalization
- `features/` graph-to-feature conversion and feature engineering
- `models/` model definitions, wrappers, and saved-model metadata helpers
- `training/` training entrypoints and experiment orchestration
- `inference/` runtime prediction services and request shaping
- `evaluation/` offline metrics, validation, and benchmark helpers
- `pipelines/` higher-level end-to-end workflows that chain steps together
- `utils/` shared ML-specific helpers

## Near-term use cases

- Suggest likely counters or next branches in a strategy graph
- Score strength or completeness of a gameplan
- Compare scenarios and recommend missing responses
- Support future boxing-first prediction experiments

