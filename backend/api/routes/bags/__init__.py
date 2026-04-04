"""
Generic bag routes for training item management.

This module provides a sport-agnostic bag system that can be reused across
any sport. Use the create_bag_router() factory to create sport-specific routers.
"""

from .router import create_bag_router

__all__ = ["create_bag_router"]
