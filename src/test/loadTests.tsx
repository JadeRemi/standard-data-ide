import { KEYS } from '../constants';
import React from '../lib';

type TFile = "ts" | "js" | "json" | "css" | "html" | null


const storageNameKeys = {
    "html": KEYS.__LS_HTML_NAME__,
    "js": KEYS.__LS_JS_NAME__,
    "ts": KEYS.__LS_TS_NAME__,
    "css": KEYS.__LS_CSS_NAME__,
    "json": KEYS.__LS_JSON_NAME__,
}

const storageContentKeys = {
    "html": KEYS.__LS_HTML__,
    "js": KEYS.__LS_JS__,
    "ts": KEYS.__LS_TS__,
    "css": KEYS.__LS_CSS__,
    "json": KEYS.__LS_JSON__,
}

const applyFileName = (fileName: string, fileType: TFile) => {

    const key = storageNameKeys[fileType]
    if (key) localStorage.setItem(key, fileName)
}

const applyFileContent = (content: string, fileType: TFile) => {
    const key = storageContentKeys[fileType]

    if (key) localStorage.setItem(key, content)

}




const parseFields = (fields: { file_name: string, value: string}[]) => {

    for (const field of fields) {
        const {file_name, value} = field;

        let fileType: TFile = null;

        if (file_name.endsWith(".html")) fileType = "html"
        if (file_name.endsWith(".js")) fileType = "js"
        if (file_name.endsWith(".tsx") || file_name.endsWith(".ts")) fileType = "ts"
        if (file_name.endsWith(".css")) fileType = "css"
        if (file_name.endsWith(".json")) fileType = "json"
    
        if (!fileType) return;
        applyFileName(file_name, fileType)
        applyFileContent(value, fileType)
    }



}


export const TestLoader = ({reload}) => {
    let value = "https://fastapi-cors-proxy-1.onrender.com/api/api/reacttask/1/";
    // let value = "http://188.68.223.11/api/tstask/1/";
    const onChange = (e) => value = e.target?.value



    const onClick = () => {
        fetch(value, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',  
            }
        }) 
            .then(response => response.json())
            .then(data => {
              
                if (!data?.text) return;
                const { text, fields } = data
                console.log("data", data, reload); 
                if (typeof text !== "string") return
         
                parseFields(fields)
                reload?.()

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        console.log(value)
    }

    return (
    <div
        style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 100,
            backgroundColor: "yellow",
            padding: "4px",
            cursor: "pointer",
            width: "152px",
            display: "flex",
            flexDirection: "row",
            gap: "4px",
        }}
      >
        <input 
             style={{
                height: "30px",
                width: "100px"
                }}
            type="text"
            value={value}
            onchange={onChange}
            />
          <button
          style={{
                height: "30px",
                width: "40px"
                }}
                onclick={onClick}
                >
                    Load
                </button>
    </div>
    )
}