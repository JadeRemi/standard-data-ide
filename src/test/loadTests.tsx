import { KEYS } from '../constants';
import React from '../lib';



export const TestLoader = ({reload}) => {
    let value = "http://188.68.223.11/api/tstask/1/";
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
                const { text } = data
                console.log("data", data, reload); 
                if (typeof text !== "string") return
                localStorage.setItem(KEYS.__LS_TS__, text)
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