"""
Boxing-specific bag routes (SQLAlchemy-backed).
"""
from uuid import uuid4

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...models.boxing.bag import BoxingBagItem
from ...models.boxing.bag_model import Bag
from ...routes.auth import get_current_user
from ...routes.bags.router import create_bag_router
from db import get_db
from db.models import TrainingBagModel, TrainingItemModel, User

router = create_bag_router("boxing", Bag, BoxingBagItem)


def _ensure_personal_boxing_bag(db: Session, user: User) -> TrainingBagModel:
    bag = (
        db.query(TrainingBagModel)
        .filter(
            TrainingBagModel.owner_id == user.id,
            TrainingBagModel.sport == "boxing",
            TrainingBagModel.name == "My Personal Bag",
        )
        .first()
    )
    if bag:
        return bag
    bag = TrainingBagModel(
        id=str(uuid4()),
        name="My Personal Bag",
        description="Default personal training bag",
        owner_id=user.id,
        is_public=False,
        sport="boxing",
    )
    db.add(bag)
    db.commit()
    db.refresh(bag)
    return bag


def _item_to_boxing(m: TrainingItemModel) -> BoxingBagItem:
    return BoxingBagItem(
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


@router.get("/", response_model=list[BoxingBagItem], summary="Get personal bag items (legacy)")
def get_personal_bag_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bag = _ensure_personal_boxing_bag(db, current_user)
    items = (
        db.query(TrainingItemModel)
        .filter(TrainingItemModel.bag_id == bag.id)
        .order_by(TrainingItemModel.name)
        .all()
    )
    return [_item_to_boxing(i) for i in items]


@router.post("/", response_model=BoxingBagItem, summary="Add item to personal bag (legacy)")
def create_personal_bag_item(
    item: BoxingBagItem,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bag = _ensure_personal_boxing_bag(db, current_user)
    iid = item.id if item.id else str(uuid4())
    m = TrainingItemModel(
        id=iid,
        bag_id=bag.id,
        name=item.name,
        description=item.description,
        item_type=item.item_type,
        entity_id=item.entity_id,
        group=item.group,
        source=item.source,
        reference_url=item.reference_url,
        mastery=item.mastery,
        learned_at=item.learned_at,
        last_practiced=item.last_practiced,
        tags=item.tags,
        notes=item.notes,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return _item_to_boxing(m)
