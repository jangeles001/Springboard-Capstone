export default function ContentBox ({ title, content }) {
  return (
    <div className="flex flex-col justify-center p-10 min-w-full">
        <h1> {title}</h1>
        <span className='flex flex-col rounded-2xl border border-black-200 shadow-md p-20 min-w-full'><p>{content}</p></span>
    </div>
  )
}