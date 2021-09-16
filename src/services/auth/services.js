import cookie from "react-cookies";
const key = "apiToken";

export const getStoredApiToken = () => JSON.parse(localStorage.getItem(key));

export const getUrlParameter = (search, name) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
};

export const getStoredUser = () =>
    JSON.parse(localStorage.getItem("currentUser"));

export const storeCurrentUser = currentUser => {
    cookie.save("isLoggedIn", true, { path: "/" });
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
};

export const storeApiToken = apiToken => {
    localStorage.setItem(key, JSON.stringify(apiToken));
};

export const removeStoredApiToken = () => {
    localStorage.removeItem(key);
};

export const removeStoredUser = () => {
    cookie.remove("isLoggedIn", { path: "/" });
    localStorage.removeItem("currentUser");
};
