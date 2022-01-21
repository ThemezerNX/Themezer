import {Middleware} from "@nuxt/types";

const authMiddleware: Middleware = ({store, redirect, route}) => {
    // If the user is not authenticated
    if (!store.state.auth.isAuthenticated) {
        return redirect("/login" + (route ? "?returnPath=" + encodeURIComponent(route.path) : ""));
    }
};

export default authMiddleware;
