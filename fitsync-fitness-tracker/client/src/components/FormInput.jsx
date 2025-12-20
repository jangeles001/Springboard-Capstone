import { preventScrollAndArrows } from "../utils/preventScrollAndArrows"

export function FormInput({ name, inputType = "text", inputValue, inputErrors,  handleChange, placeholder, styling, ...props }) {
    // Assigns functions to handlers to prevent number input default behaviors
    const handlers =
        inputType === "number"
      ? {
          onKeyDown: preventScrollAndArrows.onKeyDown,
          onWheel: preventScrollAndArrows.onWheel,
        }
      : undefined;


    return (
    <input    
        className={`${!inputErrors && "form-input"} ${inputErrors && !inputValue && 'form-input-error'} ${styling}`}
        type={inputType}
        name={name}
        value={inputValue}
        onChange={handleChange} 
        placeholder={placeholder}
        {...handlers} // NOTE: Prop handlers override any handlers passed via handlers object.
        {...props}
        >
        </input>
    )
}