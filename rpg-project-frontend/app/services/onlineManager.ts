import { onlineManager } from "@tanstack/react-query";
import { api } from "./api";

export function setUpOnlineManager() {
    onlineManager.setEventListener((setOnline) => {
        const update = () => {
            setOnline(navigator.onLine);
        }

        update();
        window.addEventListener("online", update);
        window.addEventListener("offline", update);

        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
        }
    })
}

class ConnectivityManager {
    private static apiReachable: boolean = true;

    public static checkApiReachability() {
        api.get('/health', {timeout: 10000})
            .then(() => {
                ConnectivityManager.apiReachable = true;
            })
            .catch(() => {
                ConnectivityManager.apiReachable = false;
            });
    }

    public static isApiReachable() {
        return ConnectivityManager.apiReachable;
    }

    public static isOnline() {
        return onlineManager.isOnline() && ConnectivityManager.apiReachable;
    }

}


export { ConnectivityManager }