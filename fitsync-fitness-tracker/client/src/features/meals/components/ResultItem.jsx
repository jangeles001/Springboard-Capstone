export default function ResultItem({ item, onClick }){
    return (
        <li
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onClick(item)}
        >
            {item?.description} 
        </li>
    )
}