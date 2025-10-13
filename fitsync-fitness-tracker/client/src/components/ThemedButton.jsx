export default function ThemedButton({ text, onClick }) {
    return (
        <button 
        className="mt-auto self-start px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-lg shadow hover:opacity-90 transition"
        onClick={onClick}
        >
            {text}
        </button>
    )
}