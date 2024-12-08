import { KEYS } from "../constants";

export const callTsApi = async () => {
    const typescriptContent = localStorage.getItem(KEYS.__LS_TS__) || "";
    const typescriptName = localStorage.getItem(KEYS.__LS_TS_NAME__) || "TS";
    
    try{
    const uri = "https://typescript-checker.onrender.com/parse"
const payload = {
    [typescriptName]: typescriptContent,
}

    const response = await fetch(uri, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',  
        },
        body: JSON.stringify(payload)
    })

    return response?.json();
} catch (err) {}
}