"""
Generic bag routes factory.

Creates FastAPI routers for bag management that work with any sport's bag system.
Usage: Create sport-specific routers by calling create_bag_router() with the sport's
models and databases.

This design allows multiple sports to have independent bag systems while sharing
the same route logic.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Type, Any
from uuid import uuid4
from datetime import datetime

from ...models.common.bag import BagMetadata, TrainingItem


def create_bag_router(
    sport: str,
    bag_model: Type[BagMetadata],
    item_model: Type[TrainingItem],
    bags_db: List[Any],
    items_db: List[Any],
) -> APIRouter:
    """
    Factory function to create a bag router for a specific sport.
    
    Args:
        sport: Sport name (e.g., "boxing", "basketball")
        bag_model: Pydantic model for bags (Bag from boxing module)
        item_model: Pydantic model for items (BoxingBagItem)
        bags_db: In-memory database list for bags
        items_db: In-memory database list for items
    
    Returns:
        FastAPI router configured for the sport's bag system
    """
    
    router = APIRouter(prefix="/bag", tags=["bag", sport])
    
    @router.get("/bags/", response_model=List[bag_model], summary="Get all public bags")
    def get_public_bags():
        """List all public bags for this sport."""
        return [bag for bag in bags_db if bag.is_public]
    
    @router.get("/bags/{bag_id}", response_model=bag_model, summary="Get a specific bag")
    def get_bag(bag_id: str):
        """Fetch a specific bag by ID."""
        bag = next((b for b in bags_db if b.id == bag_id), None)
        if not bag:
            raise HTTPException(status_code=404, detail=f"Bag '{bag_id}' not found")
        return bag
    
    @router.post("/bags/", response_model=bag_model, summary="Create a new bag")
    def create_bag(bag: bag_model):
        """Create a new bag."""
        if not bag.id:
            bag.id = str(uuid4())
        if not bag.created_at:
            bag.created_at = datetime.now().isoformat()
        bags_db.append(bag)
        return bag
    
    @router.put("/bags/{bag_id}", response_model=bag_model, summary="Update a bag")
    def update_bag(bag_id: str, bag_data: bag_model):
        """Update bag metadata."""
        for i, bag in enumerate(bags_db):
            if bag.id == bag_id:
                bag.updated_at = datetime.now().isoformat()
                # Copy updated fields from bag_data
                for field, value in bag_data.model_dump(exclude_unset=True).items():
                    setattr(bag, field, value)
                bags_db[i] = bag
                return bag
        raise HTTPException(status_code=404, detail=f"Bag '{bag_id}' not found")
    
    @router.delete("/bags/{bag_id}", summary="Delete a bag")
    def delete_bag(bag_id: str):
        """Delete a bag and all its items."""
        global bags_db, items_db
        
        # Find and remove bag
        bag_idx = next((i for i, b in enumerate(bags_db) if b.id == bag_id), -1)
        if bag_idx == -1:
            raise HTTPException(status_code=404, detail=f"Bag '{bag_id}' not found")
        
        bags_db.pop(bag_idx)
        
        # Remove all items in this bag
        items_db[:] = [item for item in items_db if item.bag_id != bag_id]
        
        return {"message": f"Bag '{bag_id}' deleted"}
    
    @router.get("/bags/{bag_id}/items/", response_model=List[item_model], summary="Get items in a bag")
    def get_bag_items(bag_id: str):
        """List all items in a bag."""
        return [item for item in items_db if item.bag_id == bag_id]
    
    @router.post("/bags/{bag_id}/items/", response_model=item_model, summary="Add an item to a bag")
    def create_bag_item(bag_id: str, item: item_model):
        """Add a new item to a bag."""
        # Check if bag exists
        bag = next((b for b in bags_db if b.id == bag_id), None)
        if not bag:
            raise HTTPException(status_code=404, detail=f"Bag '{bag_id}' not found")
        
        if not item.id:
            item.id = str(uuid4())
        item.bag_id = bag_id
        items_db.append(item)
        return item
    
    @router.put("/bags/{bag_id}/items/{item_id}", response_model=item_model, summary="Update a bag item")
    def update_bag_item(bag_id: str, item_id: str, item_data: item_model):
        """Update an item in a bag."""
        for i, item in enumerate(items_db):
            if item.id == item_id and item.bag_id == bag_id:
                # Update fields
                for field, value in item_data.model_dump(exclude_unset=True).items():
                    setattr(item, field, value)
                items_db[i] = item
                return item
        raise HTTPException(status_code=404, detail=f"Item '{item_id}' not found in bag '{bag_id}'")
    
    @router.delete("/bags/{bag_id}/items/{item_id}", summary="Remove an item from a bag")
    def delete_bag_item(bag_id: str, item_id: str):
        """Remove an item from a bag."""
        global items_db
        idx = next((i for i, item in enumerate(items_db) 
                   if item.id == item_id and item.bag_id == bag_id), -1)
        if idx == -1:
            raise HTTPException(status_code=404, detail=f"Item '{item_id}' not found in bag '{bag_id}'")
        
        items_db.pop(idx)
        return {"message": f"Item '{item_id}' removed from bag"}
    
    return router
