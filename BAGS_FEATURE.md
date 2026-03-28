# Bag Management Feature

This feature enables multiple bag collections for different training topics and allows users to share their bags with the community.

## Architecture

### Backend Changes
- **New Model**: `Bag` (in [api/models/boxing/bag_model.py](api/models/boxing/bag_model.py))
  - Represents a training bag collection
  - Includes ownership and sharing settings
  
- **Updated Model**: `BoxingBagItem` (in [api/models/boxing/bag.py](api/models/boxing/bag.py))
  - Now references a `bag_id` to belong to a specific Bag

- **Updated Routes**: [api/routes/boxing/bag.py](api/routes/boxing/bag.py)
  - `/boxing/bag/bags/` - List public bags
  - `/boxing/bag/bags/{bag_id}` - Get specific bag
  - `/boxing/bag/bags/` (POST) - Create new bag
  - `/boxing/bag/bags/{bag_id}/items/` - List items in a bag
  - `/boxing/bag/bags/{bag_id}/items/` (POST) - Add item to bag
  - Legacy endpoints (`/boxing/bag/`, `/boxing/bag/` POST) for backward compatibility

### Frontend Changes
- **New Component Structure**:
  - `/bags/page.tsx` - Browse all public bags
  - `/bags/[bagId]/page.tsx` - View individual bag
  - `/bag/page.tsx` - Personal bag (special case of `/bags/personal-bag`)
  
- **Updated `BagManager` Component**: Now accepts optional `bag` and `initialItems` props
  - Can work with any bag, not just personal
  - Displays bag name and description in header
  - Routes items to correct bag API endpoint

- **New API Functions** (in [lib/api.ts](lib/api.ts)):
  - `fetchPublicBags()` - Get all public bags
  - `fetchBag(bagId)` - Get specific bag and details
  - `createBag(bag)` - Create new bag
  - `fetchBagItemsByBag(bagId)` - Get items in specific bag
  - `createBagItemInBag(bagId, item)` - Add item to specific bag

## Usage Examples

### Personal Bag (Default)
- Navigate to `/bag` to view and edit your personal training bag
- Items are automatically stored in the "personal-bag" bag

### Browse Public Bags
- Go to `/bags` to see all public bags shared by the community
- Browse film studies, training methodologies, and specialized collections
- Example: Browse "Muhammad Ali Film Study" bag without editing

### View Specific Bag
- Click on any bag in `/bags` to view detailed items
- Public bags can be viewed but not edited (unless you're the owner)

### Create New Bag
- Use the API endpoint `POST /boxing/bag/bags/` to create new bags
- Set `is_public: true` to share with the community
- Include meaningful name and description

## Future Enhancements
- User authentication integration (use `owner_id` field)
- Edit/delete permissions based on ownership
- Database persistence (currently in-memory)
- Bag templates for common scenarios
- Rating and review system for public bags
- Collaborative editing features
