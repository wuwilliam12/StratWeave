"""
Generic bag routes backed by SQLAlchemy (training_bags / training_items).
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Type
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...models.common.bag import BagMetadata, TrainingItem
from ...routes.auth import get_current_user, get_current_user_optional
from db import get_db
from db.models import TrainingBagModel, TrainingItemModel, User


def _iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _bag_to_pydantic(m: TrainingBagModel, bag_model: Type[BagMetadata]) -> BagMetadata:
    return bag_model(
        id=m.id,
        name=m.name,
        description=m.description,
        owner_id=m.owner_id,
        is_public=m.is_public,
        sport=m.sport,
        created_at=m.created_at.isoformat() if m.created_at else None,
        updated_at=m.updated_at.isoformat() if m.updated_at else None,
    )


def _item_to_pydantic(m: TrainingItemModel, item_model: Type[TrainingItem]) -> TrainingItem:
    return item_model(
        id=m.id,
        name=m.name,
        description=m.description,
        item_type=m.item_type,
        entity_id=m.entity_id,
        bag_id=m.bag_id,
        group=m.group,
        source=m.source,
        reference_url=m.reference_url,
        mastery=m.mastery or "novice",
        learned_at=m.learned_at,
        last_practiced=m.last_practiced,
        tags=m.tags if m.tags is not None else [],
        notes=m.notes if m.notes is not None else {},
    )


def create_bag_router(
    sport: str,
    bag_model: Type[BagMetadata],
    item_model: Type[TrainingItem],
) -> APIRouter:
    router = APIRouter(prefix="/bag", tags=["bag", sport])

    def _get_bag_or_404(db: Session, bag_id: str) -> TrainingBagModel:
        bag = db.query(TrainingBagModel).filter(TrainingBagModel.id == bag_id).first()
        if not bag:
            raise HTTPException(status_code=404, detail=f"Bag '{bag_id}' not found")
        return bag

    def _assert_bag_access(
        bag: TrainingBagModel,
        user: User | None,
        *,
        need_write: bool = False,
    ) -> None:
        if bag.sport != sport:
            raise HTTPException(status_code=404, detail="Bag not found for this sport")
        if user is not None and bag.owner_id == user.id:
            return
        if need_write:
            raise HTTPException(status_code=403, detail="Not authorized to modify this bag")
        if bag.is_public:
            return
        raise HTTPException(status_code=403, detail="Not authorized to view this bag")

    @router.get(
        "/bags/public/",
        response_model=list[bag_model],
        summary="List public bags (no auth)",
    )
    def list_public_bags(db: Session = Depends(get_db)):
        rows = (
            db.query(TrainingBagModel)
            .filter(
                TrainingBagModel.sport == sport,
                TrainingBagModel.is_public.is_(True),
            )
            .order_by(TrainingBagModel.name)
            .all()
        )
        return [_bag_to_pydantic(b, bag_model) for b in rows]

    @router.get("/bags/", response_model=list[bag_model], summary="List bags you can access")
    def list_bags(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ):
        owned = (
            db.query(TrainingBagModel)
            .filter(
                TrainingBagModel.sport == sport,
                TrainingBagModel.owner_id == current_user.id,
            )
            .all()
        )
        public = (
            db.query(TrainingBagModel)
            .filter(
                TrainingBagModel.sport == sport,
                TrainingBagModel.is_public.is_(True),
            )
            .all()
        )
        by_id: dict[str, TrainingBagModel] = {}
        for b in owned + public:
            by_id[b.id] = b
        return [_bag_to_pydantic(b, bag_model) for b in by_id.values()]

    @router.get("/bags/{bag_id}", response_model=bag_model, summary="Get a specific bag")
    def get_bag(
        bag_id: str,
        db: Session = Depends(get_db),
        current_user: User | None = Depends(get_current_user_optional),
    ):
        bag = _get_bag_or_404(db, bag_id)
        _assert_bag_access(bag, current_user, need_write=False)
        return _bag_to_pydantic(bag, bag_model)

    @router.post("/bags/", response_model=bag_model, summary="Create a new bag")
    def create_bag(
        bag: bag_model,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ):
        bid = bag.id if bag.id else str(uuid4())
        m = TrainingBagModel(
            id=bid,
            name=bag.name,
            description=bag.description,
            owner_id=current_user.id,
            is_public=bag.is_public,
            sport=sport,
        )
        db.add(m)
        db.commit()
        db.refresh(m)
        return _bag_to_pydantic(m, bag_model)

    @router.put("/bags/{bag_id}", response_model=bag_model, summary="Update a bag")
    def update_bag(
        bag_id: str,
        bag_data: bag_model,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ):
        bag = _get_bag_or_404(db, bag_id)
        _assert_bag_access(bag, current_user, need_write=True)
        data = bag_data.model_dump(exclude_unset=True)
        for field in ("name", "description", "is_public"):
            if field in data:
                setattr(bag, field, data[field])
        bag.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(bag)
        return _bag_to_pydantic(bag, bag_model)

    @router.delete("/bags/{bag_id}", summary="Delete a bag")
    def delete_bag(
        bag_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ):
        bag = _get_bag_or_404(db, bag_id)
        _assert_bag_access(bag, current_user, need_write=True)
        db.delete(bag)
        db.commit()
        return {"message": f"Bag '{bag_id}' deleted"}

    @router.get(
        "/bags/{bag_id}/items/",
        response_model=list[item_model],
        summary="Get items in a bag",
    )
    def get_bag_items(
        bag_id: str,
        db: Session = Depends(get_db),
        current_user: User | None = Depends(get_current_user_optional),
    ):
        bag = _get_bag_or_404(db, bag_id)
        _assert_bag_access(bag, current_user, need_write=False)
        items = (
            db.query(TrainingItemModel)
            .filter(TrainingItemModel.bag_id == bag_id)
            .order_by(TrainingItemModel.name)
            .all()
        )
        return [_item_to_pydantic(i, item_model) for i in items]

    @router.post(
        "/bags/{bag_id}/items/",
        response_model=item_model,
        summary="Add an item to a bag",
    )
    def create_bag_item(
        bag_id: str,
        item: item_model,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ):
        bag = _get_bag_or_404(db, bag_id)
        _assert_bag_access(bag, current_user, need_write=True)
        iid = item.id if item.id else str(uuid4())
        m = TrainingItemModel(
            id=iid,
            bag_id=bag_id,
            name=item.name,
            description=item.description,
            item_type=item.item_type,
            entity_id=item.entity_id,
            group=item.group,
            source=item.source,
            reference_url=item.reference_url,
            mastery=item.mastery,
            learned_at=item.learned_at or _iso_now()[:10],
            last_practiced=item.last_practiced,
            tags=item.tags,
            notes=item.notes,
        )
        db.add(m)
        db.commit()
        db.refresh(m)
        return _item_to_pydantic(m, item_model)

    @router.put(
        "/bags/{bag_id}/items/{item_id}",
        response_model=item_model,
        summary="Update a bag item",
    )
    def update_bag_item(
        bag_id: str,
        item_id: str,
        item_data: item_model,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ):
        bag = _get_bag_or_404(db, bag_id)
        _assert_bag_access(bag, current_user, need_write=True)
        m = (
            db.query(TrainingItemModel)
            .filter(
                TrainingItemModel.id == item_id,
                TrainingItemModel.bag_id == bag_id,
            )
            .first()
        )
        if not m:
            raise HTTPException(
                status_code=404, detail=f"Item '{item_id}' not found in bag '{bag_id}'"
            )
        for field, value in item_data.model_dump(exclude_unset=True).items():
            if field in ("id", "bag_id"):
                continue
            if hasattr(m, field):
                setattr(m, field, value)
        db.commit()
        db.refresh(m)
        return _item_to_pydantic(m, item_model)

    @router.delete("/bags/{bag_id}/items/{item_id}", summary="Remove an item from a bag")
    def delete_bag_item(
        bag_id: str,
        item_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ):
        bag = _get_bag_or_404(db, bag_id)
        _assert_bag_access(bag, current_user, need_write=True)
        m = (
            db.query(TrainingItemModel)
            .filter(
                TrainingItemModel.id == item_id,
                TrainingItemModel.bag_id == bag_id,
            )
            .first()
        )
        if not m:
            raise HTTPException(
                status_code=404, detail=f"Item '{item_id}' not found in bag '{bag_id}'"
            )
        db.delete(m)
        db.commit()
        return {"message": f"Item '{item_id}' removed from bag"}

    return router
