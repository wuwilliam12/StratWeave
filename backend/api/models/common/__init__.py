"""
Common/shared models used across sports.
Models here are sport-agnostic and serve as base types for sport-specific implementations.
"""
from .bag import TrainingBag, TrainingItem, BagMetadata

__all__ = ["TrainingBag", "TrainingItem", "BagMetadata"]
