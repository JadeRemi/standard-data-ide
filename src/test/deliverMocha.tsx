


import React from '../lib';
import { checkIframeContent } from './checkContent';

const IframeTest = () => {


  const handleTestRun = async () => {
    const iframe = document.querySelector('iframe');
    const iframeDoc = iframe?.contentDocument;
    const pTag = iframeDoc?.querySelector('p');

    const a = checkIframeContent(
      {
        pathArray: ["p"],
        expected: "123",
        node: pTag
      }
    )

    console.log("ast", a)
  };

 

  return (

        <button
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 100,
            backgroundColor: "green",
            padding: "16px", cursor: "pointer"
          }}
          onclick={handleTestRun}
        >
          Run Test
        </button>

  );
};

export default IframeTest;