"""
SQLAlchemy models for persistent storage.
Mirror api.models.graph (Node, Edge) for the graph feature.
"""
from sqlalchemy import String, Float, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class NodeModel(Base):
    __tablename__ = "nodes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    strategy_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    label: Mapped[str] = mapped_column(Text, nullable=False)
    sport: Mapped[str | None] = mapped_column(String(32), nullable=True)
    action_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    athlete_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    position_x: Mapped[float] = mapped_column(Float, default=0)
    position_y: Mapped[float] = mapped_column(Float, default=0)
    node_type: Mapped[str] = mapped_column(String(64), default="strategy")


class EdgeModel(Base):
    __tablename__ = "edges"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    source: Mapped[str] = mapped_column(String(36), nullable=False)
    target: Mapped[str] = mapped_column(String(36), nullable=False)
    label: Mapped[str] = mapped_column(Text, default="")
    probability: Mapped[float] = mapped_column(Float, default=1.0)
    stamina_cost: Mapped[float] = mapped_column(Float, default=0)
