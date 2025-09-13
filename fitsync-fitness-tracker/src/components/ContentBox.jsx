export default function ContentBox ({ title, content }) {
  return (
    <div className="flex flex-col justify-center p-10">
        <h1> {title}</h1>
        <span className='rounded-2xl border border-black-200 p-5 shadow-sm p-20'><p>{content}</p></span>
    </div>
  )
}