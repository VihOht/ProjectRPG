import { db } from '../database/db';
import { gameService } from '../services/gameService';
import type * as T from '../types';
import { createCachedResourceRepository } from './cachedResourceRepository';


const cache = createCachedResourceRepository<
    T.ClassItem,
    'classes',
    'class',
    T.ListClassesResponse,
    T.GetClassResponse
>({
    table: db.classes,
    listKey: 'classes',
    detailKey: 'class',
    getRemoteList: gameService.getClasses,
    getRemoteById: gameService.getClassById,
});

export const getClasses = cache.getAll;
export const getClass = cache.getById;
export const syncClasses = cache.syncAll;
export const syncClass = cache.syncById;

export const classesRepository = {
    getClasses,
    getClass,
    syncClasses,
    syncClass
}
