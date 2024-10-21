const clickEvent = new MouseEvent('click', {
    bubbles: true, 
    cancelable: true, 
    view: window 
});

const inputEvent = new Event('input', {
  bubbles: true,
  cancelable: true,
});

const changeEvent = new Event('change', {
   bubbles: true,
   cancelable: true,
});

const enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    bubbles: true,
    cancelable: true,
  });
  
export const click = (button: HTMLButtonElement | undefined) => {
    if (button) button.dispatchEvent(clickEvent);
}


export const fill = (input: HTMLInputElement | undefined, str: string) => {
    if (input) {
        input.value = str
        input.dispatchEvent(inputEvent);
        //input.dispatchEvent(changeEvent);
      }
}

export const press = (input: HTMLInputElement | undefined) => {
    if (input) input.dispatchEvent(enterEvent);
}





