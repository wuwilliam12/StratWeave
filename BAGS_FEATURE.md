# Bag Management Feature - Modular Multi-Sport Architecture

This feature provides a sport-agnostic training bag system that enables users to organize, categorize, and track learned techniques/plays/strategies. The architecture is designed to support any sport and can be extended easily when new sports are added.

## Architecture Overview

### Design Principles

The bag system is built on **modularity and sport-agnosticism**:

- **Generic Core Models**: Sport-independent data structures in `api/models/common/`
- **Sport-Specific Implementations**: Sports inherit from generic models and add their own routes
- **Generic Route Factory**: `api/routes/bags/router.py` creates sport-specific routers
- **Sport Agnostic Frontend**: Components accept a `sport` parameter and use generic API functions

This design allows new sports to be added by:
1. Creating sport-specific models extending `TrainingItem` and `BagMetadata`
2. Creating sport-specific routes using `create_bag_router()`
3. Optionally creating sport-specific frontend components

### Backend Architecture

#### Generic Models (`api/models/common/bag.py`)

- **`BagMetadata`**: Base bag information (sport-agnostic)
  - `id`, `name`, `description`, `owner_id`, `is_public`, `sport`, `created_at`, `updated_at`

- **`TrainingItem`**: Generic training item for any sport
  - `id`, `name`, `description`, `item_type` (e.g., "technique", "play")
  - `entity_id` (sport-specific ID for actions/plays)
  - `bag_id`, `group`, `source`, `reference_url`, `mastery`, `learned_at`, `last_practiced`
  - `tags`, `notes` (extensible custom fields)

- **`TrainingBag`**: Complete bag with optional items
  - Extends `BagMetadata` and includes `items: List[TrainingItem]`

#### Sport-Specific Models

**Boxing** (`api/models/boxing/`)
- **`Bag`** (extends `BagMetadata`)
  - Wrapper for boxing bags with sport="boxing" context
- **`BoxingBagItem`** (extends `TrainingItem`)
  - Boxing-specific convenience: `action_id` property maps to `entity_id`
  - Represents techniques, combinations, footwork, etc.

Future sports follow the same pattern:
- `api/models/basketball/bag.py` → `Bag`, `BasketballBagItem`
- `api/models/soccer/bag.py` → `Bag`, `SoccerBagItem`
- etc.

#### Generic Routes Factory (`api/routes/bags/router.py`)

Function: `create_bag_router(sport, bag_model, item_model, bags_db, items_db)`

Creates a complete FastAPI router with standard bag operations:

**Bag Operations:**
- `GET /bag/bags/` - List public bags
- `GET /bag/bags/{bag_id}` - Get specific bag
- `POST /bag/bags/` - Create new bag
- `PUT /bag/bags/{bag_id}` - Update bag
- `DELETE /bag/bags/{bag_id}` - Delete bag

**Item Operations:**
- `GET /bag/bags/{bag_id}/items/` - List items in bag
- `POST /bag/bags/{bag_id}/items/` - Add item
- `PUT /bag/bags/{bag_id}/items/{item_id}` - Update item
- `DELETE /bag/bags/{bag_id}/items/{item_id}` - Remove item

#### Sport-Specific Routes

**Boxing** (`api/routes/boxing/bag.py`)
- Creates databases: `bags_db`, `bag_items_db`
- Calls `create_bag_router("boxing", Bag, BoxingBagItem, bags_db, bag_items_db)`
- Includes legacy endpoints (`GET /boxing/bag/`, `POST /boxing/bag/`) for backward compatibility
- Available at: `/api/boxing/bag/*`

New sports integrate similarly:
```python
# basketball/bag.py
router = create_bag_router(
    sport="basketball",
    bag_model=BasketballBag,
    item_model=BasketballBagItem,
    bags_db=basketball_bags_db,
    items_db=basketball_items_db,
)
# Available at: /api/basketball/bag/*
```

### Frontend Architecture

#### Generic API Functions (`lib/api.ts`)

**Sport-Parameterized Functions:**
- `fetchPublicBagsBySport(sport)` - Get public bags
- `fetchBagBySport(sport, bagId)` - Get specific bag
- `createBagBySport(sport, bag)` - Create bag
- `updateBagBySport(sport, bagId, updates)` - Update bag
- `deleteBagBySport(sport, bagId)` - Delete bag
- `fetchBagItemsByBagSport(sport, bagId)` - Get items
- `createBagItemInBagBySport(sport, bagId, item)` - Add item
- `updateBagItemBySport(sport, bagId, itemId, updates)` - Update item
- `deleteBagItemBySport(sport, bagId, itemId)` - Delete item

**Generic Types:**
- `TrainingItem` - Generic training item interface
- `TrainingBag` - Generic bag interface

**Boxing Convenience Functions (Deprecated):**
- `fetchPublicBags()` → `fetchPublicBagsBySport("boxing")`
- `fetchBag()` → `fetchBagBySport("boxing", bagId)`
- `createBag()` → `createBagBySport("boxing", bag)`
- etc.

These are kept for backward compatibility during transition.

#### BagManager Component (`features/bag/components/BagManager.tsx`)

Now sport-agnostic and fully generic:

**Props:**
```typescript
interface BagManagerProps {
  sport?: string; // "boxing", "basketball", etc. Defaults to "boxing"
  bag?: TrainingBag; // Bag to manage
  initialItems?: TrainingItem[]; // Pre-loaded items
  canEdit?: boolean; // Whether user can modify content
}
```

**Features:**
- Display bag name and description
- Add new training items with categorization
- Search and filter items
- Sort by name, mastery level, category, or date
- Group items by category
- Delete items (when `canEdit=true`)
- Read-only mode for shared bags

**Terminology:**
- "Training Collection" instead of "Bag"
- "Learned items" instead of "Inventory"
- "Category" instead of "Group"
- Generic "item" language works for any sport

#### Page Components

**Personal Training Collection** (`app/bag/page.tsx`)
- Hard-coded to sport="boxing" and bag="personal-bag"
- Fetches initial items to prevent jank

**Public Collections Browser** (`app/bags/page.tsx`)
- Hard-coded to sport="boxing"
- Lists all public boxing bags
- Links to individual bag page

**Individual Collection View** (`app/bags/[bagId]/page.tsx`)
- Hard-coded to sport="boxing"
- Dynamic bag ID from URL
- Displays bag details and items

**Future Sport Pages:**
- `/app/basketball/bag/` - Basketball personal bag
- `/app/basketball/bags/` - Public basketball bags
- `/app/soccer/bag/` - Soccer personal bag
- etc.

### Data Flow Example: Adding a Boxing Item

1. User fills form in `BagManager` (sport="boxing")
2. Clicks "Add to collection"
3. Calls `createBagItemInBagBySport("boxing", bagId, item)`
4. Frontend: `POST /api/boxing/bag/bags/{bagId}/items/`
5. Backend: Boxing route calls router handler from `create_bag_router()`
6. Handler sets `item.bag_id = bagId`, assigns ID, saves to `bag_items_db`
7. Response: Returns complete `BoxingBagItem`
8. Frontend: Refreshes list, shows new item grouped by category

## Adding a New Sport

### Step 1: Create Sport Models

Create `backend/api/models/{sport}/bag.py`:

```python
from ...models.common.bag import TrainingItem, BagMetadata
from typing import Optional

class Bag(BagMetadata):
    """Basketball training bag."""
    pass

class BasketballBagItem(TrainingItem):
    """Basketball training item (play, set, drill, etc.)."""
    
    @property
    def play_id(self) -> Optional[str]:
        """Convenience property mapping to entity_id."""
        return self.entity_id
    
    @play_id.setter
    def play_id(self, value: Optional[str]):
        self.entity_id = value
```

### Step 2: Create Sport-Specific Routes

Create `backend/api/routes/{sport}/bag.py`:

```python
from typing import List
from ...models.{sport}.bag import Bag, {Sport}BagItem
from ...routes.bags import create_bag_router

# In-memory databases
bags_db: List[Bag] = []
items_db: List[{Sport}BagItem] = []

# Create router using factory
router = create_bag_router(
    sport="{sport}",
    bag_model=Bag,
    item_model={Sport}BagItem,
    bags_db=bags_db,
    items_db=items_db,
)
```

### Step 3: Register Routes

Update `backend/api/routes/{sport}/__init__.py`:

```python
from .bag import router as bag_router
{sport}_router.include_router(bag_router)
```

### Step 4: Frontend Components (Optional)

Create sport-specific pages if desired:

- `frontend/app/{sport}/bag/page.tsx` - Personal bag
- `frontend/app/{sport}/bags/page.tsx` - Public bags browser
- `frontend/app/{sport}/bags/[bagId]/page.tsx` - Individual bag

Use `BagManager` component with `sport="{sport}"` prop.

### Step 5: Update Types (Optional)

Extend `TrainingItem` and `TrainingBag` in `frontend/types/bag.ts` if sport needs custom fields.

## Migration Notes

### From Old Boxing System

The old boxing-specific bag system is fully preserved:

- **Legacy endpoints** still work: `GET /boxing/bag/`, `POST /boxing/bag/`
- **Old API functions** still work: `fetchBagItems()`, `createBagItem()`
- These are marked `@deprecated` but functional

### Transition Path

1. Old code using `fetchBagItems()` → switch to `fetchBagItemsByBagSport("boxing", "personal-bag")`
2. Components using old `BoxingBagItem` type → use `TrainingItem`
3. Old `Bag` type → use `TrainingBag`
4. Update `BagManager` imports to use new types
5. Remove deprecation warnings once fully transitioned

## Configuration

### Environment Variables

None required. Sports are defined in router creation.

### Database

Currently all sports use in-memory databases (one per sport, in each sport's route file).

When migrating to persistent storage:
- Create unified `training_bags` and `training_items` tables with sport column
- OR create per-sport tables using the same schema
- Repository pattern can abstract the choice

## Testing

### Add Unit Tests For:

- Generic `TrainingItem` and `BagMetadata` models
- `create_bag_router()` factory
- Boxing-specific models (inheritance, aliases)
- All API endpoints for boxing
- `BagManager` component with different sports
- Generic API client functions

### Test Coverage Points:

- Creating bags and items
- Listing public/private bags
- Filtering and sorting items
- Deleting items (and cascading)
- Sport parameter routing
- Backward compatibility endpoints
- Permission checks (writable vs read-only bags)

## Future Enhancements

1. **Database Persistence**: Move from in-memory to SQLAlchemy ORM
2. **Permission System**: Owner/edit/view permissions per bag
3. **Sharing**: Clone bags, fork bags, collaborative editing
4. **Rich Data**: Video references, external API integration (YouTube, etc.)
5. **Analytics**: Track learning progression, mastery heatmaps
6. **Advanced Filtering**: Tag-based, date range, source-based
7. **Batch Operations**: Import/export bags (CSV, JSON)
8. **Sport-Specific UI**: Custom fields and layouts per sport
