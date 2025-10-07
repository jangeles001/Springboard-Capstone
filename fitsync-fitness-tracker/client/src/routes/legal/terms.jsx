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
        fetch('../../../legal/termsofservice.md')
        .then((res) => res.text())
        .then(setContent)
        .catch(console.error);
    },[])

  return (
    <div className='prose prose-lg prose-indigo dark:prose-invert max-w-4xl mx-auto p-'>
        <ReactMarkdown 
        remarkPlugins={[remarkSlug]} 
        components={{
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


//    <div className="bg-gray-50 text-gray-800">
    //         <header className="max-w-4xl mx-auto p-6 border-b border-gray-200">
    //             <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
    //                 Terms
    //             </p>
    //             <h1 className="text-3xl font-bold">Terms of Service</h1>
    //             <p className="text-gray-600 mt-1">
    //                 Effective date: <strong>{`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`}</strong>
    //             </p>
    //         </header>

    //         <main className="max-w-4xl mx-auto p-6 space-y-8">
    //             <section>
    //                 <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
    //                 <p>
    //                     By accessing or using <strong>[AppName]</strong>, you agree to be
    //                     bound by these Terms of Service and our Privacy Policy.
    //                 </p>
    //             </section>

    //             <section>
    //                 <h2 className="text-2xl font-semibold mb-2">2. Use of the App</h2>
    //                 <ul className="list-disc pl-6 space-y-1">
    //                     <li>You must be at least 13 years old (or minimum age in your region).</li>
    //                     <li>You agree to use the App only for lawful purposes.</li>
    //                     <li>You are responsible for maintaining the confidentiality of your account.</li>
    //                 </ul>
    //             </section>

    //             <section>
    //                 <h2 className="text-2xl font-semibold mb-2">3. Subscriptions & Payments</h2>
    //                 <p>
    //                     If you purchase a subscription, you agree to pay all applicable fees.
    //                     Payment processing is handled by third-party providers.
    //                 </p>
    //             </section>


    //             <section>
    //                 <h2 className="text-2xl font-semibold mb-2">4. Health Disclaimer</h2>
    //                 <p>
    //                     <strong>[AppName]</strong> provides exercise recommendations but is
    //                     not a substitute for professional medical advice. Consult your doctor
    //                     before starting any fitness program.
    //                 </p>
    //             </section>


    //             <section>
    //                 <h2 className="text-2xl font-semibold mb-2">5. Termination</h2>
    //                 <p>
    //                     We may suspend or terminate your account if you violate these Terms
    //                     or misuse the App.
    //                 </p>
    //             </section>


    //             <section>
    //                 <h2 className="text-2xl font-semibold mb-2">6. Limitation of Liability</h2>
    //                 <p>
    //                     To the fullest extent permitted by law, <strong>[Company Name]</strong>
    //                     is not liable for damages arising from use of the App.
    //                 </p>
    //             </section>


    //             <section>
    //                 <h2 className="text-2xl font-semibold mb-2">7. Governing Law</h2>
    //                 <p>These Terms are governed by the laws of [Jurisdiction].</p>
    //             </section>


    //             <section>
    //             <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
    //                 <address className="not-italic">
    //                     <strong>[Company Name]</strong>
    //                     <br />
    //                         [Address]
    //                     <br />
    //                     <a href="mailto:[Contact Email]" className="text-blue-600">
    //                         [Contact Email]
    //                     </a>
    //                 </address>
    //             </section>
    //         </main>


    //         <footer className="max-w-4xl mx-auto p-6 border-t border-gray-200 text-sm text-gray-500">
    //         <p>
    //             © <span>{new Date().getFullYear()}</span> [Company Name]. All rights
    //             reserved.
    //         </p>
    //         </footer>
    //     </div>