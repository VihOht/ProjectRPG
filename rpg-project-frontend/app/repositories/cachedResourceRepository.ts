type EntityWithId = {
  id: number;
};

type CacheTable<TItem extends EntityWithId> = {
  toArray: () => Promise<TItem[]>;
  get: (id: number) => Promise<TItem | undefined>;
  bulkPut: (items: TItem[]) => Promise<unknown>;
  put: (item: TItem) => Promise<unknown>;
};

type ListResponse<TKey extends string, TItem extends EntityWithId> = Record<TKey, TItem[]>;
type DetailResponse<TKey extends string, TItem extends EntityWithId> = Record<TKey, TItem>;

type CachedResourceRepositoryConfig<
  TItem extends EntityWithId,
  TListKey extends string,
  TDetailKey extends string,
  TListResponse extends ListResponse<TListKey, TItem>,
  TDetailResponse extends DetailResponse<TDetailKey, TItem>
> = {
  table: CacheTable<TItem>;
  listKey: TListKey;
  detailKey: TDetailKey;
  getRemoteList: () => Promise<TListResponse>;
  getRemoteById: (id: number) => Promise<TDetailResponse>;
};

export function createCachedResourceRepository<
  TItem extends EntityWithId,
  TListKey extends string,
  TDetailKey extends string,
  TListResponse extends ListResponse<TListKey, TItem>,
  TDetailResponse extends DetailResponse<TDetailKey, TItem>
>({
  table,
  listKey,
  detailKey,
  getRemoteList,
  getRemoteById,
}: CachedResourceRepositoryConfig<TItem, TListKey, TDetailKey, TListResponse, TDetailResponse>) {
  async function getAll(): Promise<TListResponse> {
    const cache = await table.toArray();

    return { [listKey]: cache } as TListResponse;
  }

  async function getById(id: number): Promise<TDetailResponse> {
    const cache = await table.get(id);

    if (!cache) {
      throw new Error(`${detailKey} not found in cache`);
    }

    return { [detailKey]: cache } as TDetailResponse;
  }

  async function syncAll() {
    const remote = await getRemoteList();
    await table.bulkPut(remote[listKey]);
  }

  async function syncById(id: number) {
    const remote = await getRemoteById(id);
    await table.put(remote[detailKey]);
  }

  return {
    getAll,
    getById,
    syncAll,
    syncById,
  };
}
