// ==================== INVENTORIES ====================

export type InventoryType =
  | "CARRIED"
  | "EQUIPED"
  | "TRANSPORT"
  | string;

export type InventoryItem = {
  id: number;
  

  name: string;
  description: string;

  type: InventoryType;
  capacity: number;
};

export type ListInventoriesResponse = {
  inventories: InventoryItem[];
};

export type CreateInventoryRequest = {
  name: string;
  description: string;
  type: InventoryType;
  capacity?: number;
};

export type CreateInventoryResponse = {
  message: string;
  inventory: InventoryItem;
};

export type UpdateInventoryRequest = {
  name?: string;
  description?: string;
  capacity?: number;
};

export type UpdateInventoryResponse = {
  message: string;
  inventory: InventoryItem;
};

export type CreateStandardInventoriesResponse = {
  message: string;
  inventories: InventoryItem[];
};

export type InventoryTypesResponse = {
  inventory_types: InventoryType[];
};

export type TransferInventoryOwnershipResponse = {
  message: string;
  inventory: InventoryItem;
};

// ==================== ITEMS ====================

export type BaseItem = {
  id: number;

  name: string;
  description: string;

  stackable: boolean;
  equipable: boolean;
  max_quantity: number | null;
  temporary?: boolean;
  hidden?: boolean;

  item_type: "weapon" | "armor" | "artefact" | "utility";
};

export type ToggleItemVisibilityResponse = {
  message: string;
  item: Item;
};

export type ToggleItemTemporaryResponse = {
  message: string;
  item: Item;
};

export type WeaponItem = BaseItem & {
  item_type: "weapon";

  damage: string;
  pericia: string;
  critical: string;
  range: string;
};

export type ArmorItem = BaseItem & {
  item_type: "armor";

  resistance: string;
  reduction: string;
  pericia: string;
  size: string;
  effect: string;
};

export type ArtefactItem = BaseItem & {
  item_type: "artefact";

  effect: string;
};

export type UtilityItem = BaseItem & {
  item_type: "utility";
};

export type Item =
  | WeaponItem
  | ArmorItem
  | ArtefactItem
  | UtilityItem;

export type ListItemsResponse = {
  items: Item[];
};

export type GetItemResponse = {
  item: Item;
};

export type CreateItemRequest = {
  name: string;
  description: string;

  item_type: "weapon" | "armor" | "artefact" | "utility";

  stackable?: boolean;
  equipable?: boolean;
  max_quantity?: number;

  data?: Record<string, any>;
};

export type CreateItemResponse = {
  message: string;
  item: Item;
};

export type UpdateItemRequest = {
  name?: string;
  description?: string;

  stackable?: boolean;
  equipable?: boolean;
  max_quantity?: number;

  data?: Record<string, any>;
};

export type UpdateItemResponse = {
  message: string;
  item: Item;
};

// ==================== INVENTORY ITEMS ====================

export type InventoryEntry = Item & {
  inventory_id: number;
  item_id: number;
  quantity: number;
};

export type InventoryItemsResponse = {
  items: Record<string, InventoryEntry[]>;
};

export type AddInventoryItemRequest = {
  item_id: number;
  quantity?: number;
};

export type AddInventoryItemResponse = {
  message: string;
  inventory_item: InventoryEntry;
};

export type RemoveInventoryItemRequest = {
  quantity?: number;
};

export type RemoveInventoryItemResponse = {
  message: string;
  inventory_item: InventoryEntry | null;
};

export type TransferInventoryItemRequest = {
  item_id: number;
  quantity?: number;
};