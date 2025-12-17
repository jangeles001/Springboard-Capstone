import { preventScrollAndArrows } from "../utils/preventScrollAndArrows"

export function FormInput({ name, inputType = "text", inputValue, inputErrors,  handleChange, placeholder,  }) {
   const handlers = {}

   // Assigns appropriate functions to handlers
   if(inputType === "number"){
    handlers.onKeyDown = preventScrollAndArrows.onKeyDown;
    handlers.onWheel = preventScrollAndArrows.onWheel;
   }

    return (
    <input    
        className={`form-input ${inputErrors && !inputValue && 'form-input-error'}`}
        type={inputType}
        name={name}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        {...handlers} // spreads handlers into input element
        >
        </input>
    )
}