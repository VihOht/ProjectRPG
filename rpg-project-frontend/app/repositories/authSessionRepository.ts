import { db } from "../database/db";
import type { AuthSession } from "../database/db";

export interface UpdateAuthSessionRequest {
    token: string;
    expiresAt: number;
}

async function getAuthSession() {
    const authSession = await db.authSessions.get(1);
    if (!authSession) {
        return null; // No session found
    }
    return authSession;
}

async function updateAuthSession(data: UpdateAuthSessionRequest) {
    const authSession = await db.authSessions.get(1);
    if (!authSession) {
        return null; // No session to update
    }

    return await db.authSessions.update(1, {
        token: data.token,
        expiresAt: new Date(data.expiresAt),
        verifiedAt: new Date()
    });
}

async function deleteAuthSession() {
    db.authSessions.clear(); // Clear all sessions
    return await db.authSessions.delete(1);
}

async function createAuthSession(token: string, expiresAt: number, user: AuthSession["user"]) {
    const authSession = await db.authSessions.get(1);
    if (authSession) {
        if (authSession.token !== token || authSession.expiresAt.getTime() !== expiresAt) {
            return await db.authSessions.update(1, {
                token: token,
                expiresAt: new Date(Date.now() + expiresAt),
                user: user,
                verifiedAt: new Date()
            });
        }
        return authSession; // Return existing session if it matches
    }
    return await db.authSessions.add({
        id: 1,
        token: token,
        user: user,
        expiresAt: new Date(Date.now() + expiresAt),
        verifiedAt: new Date()
    });
}  


export const authSessionRepository = {
    getAuthSession,
    updateAuthSession,
    deleteAuthSession,
    createAuthSession
};