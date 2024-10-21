
export const initKeyBoard = ({ onSave }: { onSave: Function }) => {
  window.addEventListener("keydown", e => {
    const keyCode = e.keyCode || e.which || e.charCode
    const altKey = e.ctrlKey
    if (altKey && keyCode == 83) {
      onSave()
      e.preventDefault()
      return false
    }
  })
}
