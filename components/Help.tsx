'use client'
import Link from 'next/link'

export default function Help() {
  const helpTopics = [
    {
      title: 'Getting Started',
      items: [
        'How to create an account',
        'Taking your first lesson',
        'Setting up your profile'
      ]
    },
    {
      title: 'Troubleshooting',
      items: [
        'Microphone not working',
        'Lesson progress not saving',
        'Payment issues'
      ]
    }
  ]

  const externalResources = [
    {
      name: 'User Guide',
      url: '/documentation/user-guide'
    },
    {
      name: 'FAQ',
      url: '/documentation/faq'
    },
    {
      name: 'Contact Support',
      url: 'mailto:support@lessay.com'
    }
  ]

  return (
    <div className="help-container p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      
      <div className="help-sections grid md:grid-cols-2 gap-6">
        {helpTopics.map((section, index) => (
          <div key={index} className="help-section bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <ul className="list-disc pl-5">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="mb-2">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="external-resources mt-8">
        <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
        <div className="flex flex-wrap gap-4">
          {externalResources.map((resource, index) => (
            <Link
              key={index}
              href={resource.url}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {resource.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}