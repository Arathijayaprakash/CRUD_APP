const API_URL = "http://localhost:5000/users";

export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}?email=${email}&password=${password}`);
    const data = await res.json();
    return data.length > 0 ? data[0] : null;
};

export const registerUser = async (user: any) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return await res.json();
};