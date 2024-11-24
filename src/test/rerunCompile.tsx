
import React from '../lib';

export const CompileRunner = ({rerun}) => {

    const onClick = () => {
        rerun()
    }

    return (
    <div
        style={{
            position: 'absolute',
            bottom: '10px',
            left: '240px',
            zIndex: 100,
            backgroundColor: "pink",
            padding: "4px",
            cursor: "pointer",
            width: "55px",
            display: "flex",
            flexDirection: "row",
            gap: "4px",
        }}
      >
          <button
          style={{
                height: "30px",
                width: "55px",
                whiteSpace: "nowrap"
                }}
                onclick={onClick}
                >
                    Run ▶
                </button>
    </div>
    )
}