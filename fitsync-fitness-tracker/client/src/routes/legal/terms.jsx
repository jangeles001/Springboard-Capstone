import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkSlug from 'remark-slug';

export const Route = createFileRoute('/legal/terms')({
    component: Terms,
});

function Terms(){

const [ content, setContent ] = useState("");

    useEffect(() => {
        fetch('../../../legal/termsofservice.md') // Fetches data from legal terms of service markdown file
        .then((res) => res.text())
        .then(setContent)
        .catch(console.error);
    },[])

  return (
    <div className='prose prose-lg prose-indigo dark:prose-invert max-w-4xl mx-auto p-'>
        <ReactMarkdown 
        remarkPlugins={[remarkSlug]} 
        components={{ 
          // Custom renderers for markdown elements to apply Tailwind CSS classes
          h1: ({ node, ...props}) => (
            <h1 className='text-3xl' {...props} />
          ),
          p: ({ node, ...props}) => (
            <p className='text-1xl p-3' {...props}/>
          ),
          h2: ({ node, ...props}) => (
            <h2 className='text-2xl' {...props}/>
          ),
          a: ({ node, ...props}) => (
            <a className='text-1xl hover:underline' {...props}/>
          ),
          ol: ({ node, ...props}) => (
            <ol className='flex flex-col items-center p-5 gap-3 bg-gray-200 m-3' {...props}/>
          ),
          ul: ({ node, ...props }) => (
            <ul className='flex flex-col p-5 gap-3' {...props}/>
          )
        }}
        >{content}</ReactMarkdown>
    </div>

    )
}