import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import ReactMarkdown from "react-markdown"
import remarkSlug from "remark-slug"

export const Route = createFileRoute('/legal/privacy')({
  component: Privacy,
})

function Privacy() {

    const [ content, setContent ] = useState("");

    useEffect(() => {
        fetch('../../../legal/privacypolicy.md')
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

//   <div className="flex items-center justify-center">
    //         <div className="bg-gray-50 text-gray-800">
    //             <header className="max-w-4xl mx-auto p-6 border-b border-gray-200">
    //                 <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Privacy</p>
    //                 <h1 className="text-3xl font-bold">Privacy Policy</h1>
    //                 <p className="text-gray-600 mt-1">
    //                     Effective date: <strong>[Month DD, YYYY]</strong>
    //                 </p>
    //                 <p className="mt-4">
    //                     Welcome to <strong>[AppName]</strong> (the “App”), provided by <strong>[Company Name]</strong>. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our exercise and fitness services.
    //                 </p>
    //                 <p className="mt-2 italic text-gray-500">
    //                     This document is for informational purposes only and does not constitute legal advice.
    //                 </p>
    //             </header>


    //             <main className="max-w-4xl mx-auto p-6 space-y-8">
    //                 <nav className="bg-gray-100 p-4 rounded-lg">
    //                     <h2 className="font-semibold mb-2">Contents</h2>
    //                     <ol className="list-decimal list-inside space-y-1 text-blue-600">
    //                         <li><a href="#info-we-collect">Information We Collect</a></li>
    //                         <li><a href="#how-we-use">How We Use Information</a></li>
    //                         <li><a href="#cookies">Cookies & Analytics</a></li>
    //                         <li><a href="#storage">Data Storage & Security</a></li>
    //                         <li><a href="#sharing">How We Share Information</a></li>
    //                         <li><a href="#children">Children's Privacy</a></li>
    //                         <li><a href="#rights">Your Rights</a></li>
    //                         <li><a href="#changes">Changes</a></li>
    //                         <li><a href="#contact">Contact Us</a></li>
    //                     </ol>
    //                 </nav>

    //                 <section id="info-we-collect">
    //                     <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
    //                     <ul className="list-disc pl-6 space-y-1">
    //                         <li>Account Data: name, email, password (hashed).</li>
    //                         <li>
    //                             Fitness Data: height, weight, age, activity level, goals, and
    //                             workout preferences.
    //                         </li>
    //                         <li>Device Data: IP address, browser type, operating system.</li>
    //                         <li>
    //                             Optional integrations with wearables or third-party services for
    //                             enhanced recommendations.
    //                         </li>
    //                     </ul>
    //                 </section>


    //                 <section id="how-we-use">
    //                     <h2 className="text-2xl font-semibold mb-2">How We Use Information</h2>
    //                     <ul className="list-disc pl-6 space-y-1">
    //                         <li>Provide and personalize workout recommendations.</li>
    //                         <li>Process transactions and send updates.</li>
    //                         <li>Analyze usage to improve exercise programs and features.</li>
    //                         <li>Ensure security and compliance with laws.</li>
    //                     </ul>
    //                 </section>


    //                 <section id="cookies">
    //                     <h2 className="text-2xl font-semibold mb-2">Cookies & Analytics</h2>
    //                     <p>
    //                         We use cookies and similar technologies for authentication,
    //                         preferences, and analytics. You can manage cookies in your browser
    //                         settings.
    //                     </p>
    //                 </section>


    //                 <section id="storage">
    //                     <h2 className="text-2xl font-semibold mb-2">Data Storage & Security</h2>
    //                     <p>
    //                         We use safeguards to protect your information, but no system is 100%
    //                         secure.
    //                     </p>
    //                     </section>


    //                 <section id="sharing">
    //                     <h2 className="text-2xl font-semibold mb-2">How We Share Information</h2>
    //                     <ul className="list-disc pl-6 space-y-1">
    //                         <li>Service providers (hosting, analytics, payments).</li>
    //                         <li>Legal and compliance reasons.</li>
    //                         <li>With your consent for optional features and integrations.</li>
    //                     </ul>
    //                 </section>


    //                 <section id="children">
    //                     <h2 className="text-2xl font-semibold mb-2">Children's Privacy</h2>
    //                     <p>
    //                         The App is not intended for children under 13. We do not knowingly
    //                         collect information from children.
    //                     </p>
    //                 </section>


    //                 <section id="rights">
    //                     <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
    //                     <p>
    //                         You may request access, correction, or deletion of your data. Contact
    //                         us at <a href="mailto:[Contact Email]" className="text-blue-600">[Contact Email]</a>.
    //                     </p>
    //                 </section>


    //                 <section id="changes">
    //                     <h2 className="text-2xl font-semibold mb-2">Changes</h2>
    //                     <p>
    //                         We may update this Privacy Policy and will notify you of significant
    //                         changes.
    //                     </p>
    //                 </section>


    //                 <section id="contact">
    //                     <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
    //                     <address className="not-italic">
    //                         <strong>[Company Name]</strong>
    //                         <br />
    //                             [Address]
    //                         <br />
    //                         <a href="mailto:[Contact Email]" className="text-blue-600">
    //                             [Contact Email]
    //                         </a>
    //                     </address>
    //                 </section>
    //             </main>


    //             <footer className="max-w-4xl mx-auto p-6 border-t border-gray-200 text-sm text-gray-500">
    //                 <p>
    //                     © <span>{new Date().getFullYear()}</span> [Company Name]. All rights
    //                     reserved.
    //                 </p>
    //             </footer>
    //         </div>
    //     </div>