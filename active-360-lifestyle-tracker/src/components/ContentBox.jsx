export default function ContentBox ({ title, content }) {
  return (
    <div className="flex flex-col justify-center p-10">
        <h1> {title}</h1>
        <span className='border-2 border-solid p-20'><p>{content}</p></span>
    </div>
  )
}