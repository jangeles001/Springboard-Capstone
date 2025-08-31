export default function ContentBox ({ title, content }) {
  return (
    <div className="flex flex-column justify-center p-[10px]">
        <h1> {title}</h1>
        <span className='border-2 border-solid p-[20px]'><p>{content}</p></span>
    </div>
  )
}