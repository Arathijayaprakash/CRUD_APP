const API_URL = "http://localhost:5000/users";

export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}?email=${email}&password=${password}`);
    const data = await res.json();
    if (data.length === 0) return null;
    const { id, name, email: userEmail, dob, country } = data[0];
    const token = btoa(`${id}:${email}:${Date.now()}`);
    return { id, name, email: userEmail, dob, country, token };
};

export const registerUser = async (user: any) => {
    const checkRes = await fetch(`${API_URL}?email=${user.email}`);
    const existingUsers = await checkRes.json();
    if (existingUsers.length > 0) {
        return { error: "User already exists" };
    }
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return await res.json();
};