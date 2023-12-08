import { Notification } from "./Notification";

const API_URL = "https://ethereal-acute-beanie.glitch.me/";
// const API_URL = "http://localhost:8080/";

export const getComedians = async () => {
    try {
        const response = await fetch(`${API_URL}comedians`);
        if (!response.ok) {
            throw new Error(`Server was error: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.log(`Problem with fetch: ${error.message}`);

        Notification.getInstance().show("Server error. Try later.");
    }
};

export const getClient = async (ticket) => {
    try {
        const response = await fetch(`${API_URL}clients/${ticket}`);
        if (!response.ok) {
            throw new Error(`Server was error: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.log(`Problem with fetch: ${error.message}`);

        Notification.getInstance().show("Server error. Try later.");
    }
};

export const sendData = async (method, data, id) => {
    try {
        const response = await fetch(
            `${API_URL}clients${id ? `/${id}` : ""}`,
            {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        if (!response.ok) {
            throw new Error(`Server was error: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.log(`Problem with fetch: ${error.message}`);

        Notification.getInstance().show("Server error. Try later.");
        return false;
    }
};
