"use client";

const lastUpdated = "May 2, 2026";

const sections = [
    {
        title: "1. Acceptance of Terms",
        body: [
            "Welcome to Mike. These Terms of Service are a legally binding agreement between you and Mike regarding your access to and use of our website, hosted application, open-source software, APIs, and related services.",
            "By creating an account, clicking to accept these Terms, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you may not use the Service.",
        ],
    },
    {
        title: "2. Service Overview",
        body: [
            "Mike provides legal AI workflow tools, including document upload, project workspaces, document chat, citations, tabular review, reusable workflows, and document drafting or editing features.",
            "Mike hosted on MikeOSS.com is currently provided as a demo service for evaluation and testing purposes only. You should not upload, submit, transmit, or store sensitive, confidential, privileged, proprietary, personally identifiable, client, or otherwise restricted information through the Service. Use the Service only with non-sensitive materials and at your own risk.",
            "The Service may connect to third-party large language model providers, hosting providers, authentication services, storage services, and payment or infrastructure providers. We may add, remove, suspend, or modify features or third-party integrations at any time.",
        ],
    },
    {
        title: "3. Eligibility and Authority",
        body: [
            "You must be at least 13 years old to use the Service. If you are under 18, you must have permission from a parent or legal guardian.",
            "If you use the Service on behalf of a company, law firm, organization, or other entity, you represent that you have authority to bind that entity to these Terms.",
        ],
    },
    {
        title: "4. Accounts and Security",
        body: [
            "You may need an account to access most features. You agree to provide accurate account information and to keep it up to date.",
            "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. If you believe your account is compromised, contact us promptly at team@mikeoss.com.",
        ],
    },
    {
        title: "5. Fees, Credits, and Third-Party Costs",
        body: [
            "Some features may be free, metered, usage-limited, or paid. We may introduce or change fees, plans, credits, quotas, or usage limits with notice where required by law.",
            "If you connect your own third-party AI provider API keys, you are responsible for any charges, usage limits, provider terms, or account restrictions imposed by those providers.",
            "Unless otherwise stated at the time of purchase, fees are non-refundable except where required by law.",
        ],
    },
    {
        title: "6. User Content and AI Outputs",
        body: [
            "You may submit documents, prompts, text, files, data, and other materials to the Service (\"Input\") and receive AI-generated or system-generated responses, summaries, extractions, drafts, edits, citations, or other content (\"Output\"). Input and Output are collectively \"User Content.\"",
            "As between you and Mike, you retain any rights you have in your Input. Subject to applicable law and third-party provider terms, you are responsible for evaluating and using Output.",
            "You grant Mike a limited license to host, store, process, transmit, display, and otherwise use User Content as necessary to provide, secure, troubleshoot, improve, and support the Service.",
            "You represent that you have all rights and permissions necessary to submit Input to the Service and that your Input and use of the Service will not violate law, third-party rights, confidentiality duties, court orders, professional obligations, or applicable provider terms.",
        ],
    },
    {
        title: "7. Legal and Professional Responsibility",
        body: [
            "Mike is a software tool. It does not provide legal, financial, tax, regulatory, compliance, or professional advice, and it does not create an attorney-client relationship.",
            "AI systems can produce inaccurate, incomplete, outdated, or misleading Output. You are solely responsible for reviewing, verifying, and exercising professional judgment before relying on any Output or using it in client work, filings, transactions, negotiations, or legal advice.",
        ],
    },
    {
        title: "8. Third-Party AI Models and Services",
        body: [
            "The Service may route Input to third-party AI models or infrastructure providers selected by you, configured by your account, or made available through the Service.",
            "Your use of third-party models or services may be subject to additional terms, policies, data practices, retention settings, training settings, and usage restrictions. We are not responsible for third-party services, model availability, model behavior, pricing, outages, or provider terms.",
        ],
    },
    {
        title: "9. Prohibited Conduct",
        body: [
            "You agree not to use the Service for unlawful, harmful, infringing, deceptive, abusive, or security-compromising activity.",
            "You may not attempt to gain unauthorized access to the Service or any account, interfere with the Service, upload malware, scrape or copy the Service except as permitted by law or applicable open-source licenses, bypass usage limits, misrepresent your identity, or use the Service in violation of any third-party AI provider terms.",
            "You may not submit Input that you do not have the right to use, that violates confidentiality or privacy obligations, or that infringes intellectual property or other third-party rights.",
        ],
    },
    {
        title: "10. Open-Source Software and Ownership",
        body: [
            "Certain Mike software may be made available under open-source licenses. Your use, copying, modification, and distribution of that open-source software is governed by the applicable open-source license, not these Terms.",
            "The hosted Service, website, brand, design, trade names, hosted infrastructure, documentation, and non-open-source elements are owned by Mike or its licensors and are protected by intellectual property and other laws.",
        ],
    },
    {
        title: "11. Feedback",
        body: [
            "If you provide comments, suggestions, ideas, or feedback, you grant us a perpetual, irrevocable, worldwide, royalty-free license to use that feedback for any purpose without obligation to compensate you.",
        ],
    },
    {
        title: "12. Confidentiality",
        body: [
            "Each party may receive non-public information from the other in connection with the Service. The receiving party will use reasonable care to protect confidential information and will use it only for purposes related to the Service, except where disclosure is required by law or authorized by the disclosing party.",
            "Confidential information does not include information that is public through no fault of the receiving party, already known without a confidentiality duty, lawfully received from a third party, independently developed, or submitted as feedback.",
        ],
    },
    {
        title: "13. Privacy and Data Protection",
        body: [
            "Please review our Privacy Policy for information about how we collect, use, store, and disclose personal information. The Privacy Policy is incorporated into these Terms.",
            "If you use the Service on behalf of an organization and require a data processing agreement, contact us at team@mikeoss.com.",
        ],
    },
    {
        title: "14. Suspension and Termination",
        body: [
            "You may stop using the Service at any time. We may suspend or terminate your access to the Service if you violate these Terms, create risk for the Service or other users, or if we discontinue the Service or any material feature.",
            "Upon termination, your right to use the Service ends, but provisions that by their nature should survive will survive, including provisions about User Content, ownership, confidentiality, disclaimers, limitations of liability, indemnity, and dispute resolution.",
        ],
    },
    {
        title: "15. Disclaimers",
        body: [
            "THE SERVICE, OUTPUT, MATERIALS, AND ALL CONTENT AVAILABLE THROUGH THE SERVICE ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY.",
            "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, NON-INFRINGEMENT, ACCURACY, AVAILABILITY, SECURITY, AND RELIABILITY.",
            "WE DO NOT WARRANT THAT THE SERVICE OR OUTPUT WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, CURRENT, COMPLETE, OR SUITABLE FOR ANY PARTICULAR LEGAL OR PROFESSIONAL USE.",
        ],
    },
    {
        title: "16. Limitation of Liability",
        body: [
            "TO THE MAXIMUM EXTENT PERMITTED BY LAW, MIKE AND ITS AFFILIATES, OFFICERS, EMPLOYEES, CONTRACTORS, AGENTS, SUPPLIERS, AND LICENSORS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST REVENUE, LOST DATA, LOSS OF GOODWILL, BUSINESS INTERRUPTION, OR SUBSTITUTE SERVICES.",
            "THE SERVICE IS PROVIDED FREE OF CHARGE. TO THE MAXIMUM EXTENT PERMITTED BY LAW, MIKE WILL NOT BE LIABLE FOR ANY DAMAGES ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS.",
        ],
    },
    {
        title: "17. Indemnity",
        body: [
            "You will defend, indemnify, and hold harmless Mike and its affiliates, officers, employees, contractors, agents, suppliers, and licensors from and against claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising from your use of the Service, your User Content, your violation of these Terms, your violation of law, or your violation of third-party rights.",
        ],
    },
    {
        title: "18. Changes to These Terms",
        body: [
            "We may modify these Terms from time to time. If changes materially affect your rights or obligations, we will provide reasonable notice, such as by posting the updated Terms or sending an email or in-product notice.",
            "Your continued use of the Service after the effective date of updated Terms means you accept the updated Terms. If you do not agree, you must stop using the Service.",
        ],
    },
    {
        title: "19. Governing Law and Dispute Resolution",
        body: [
            "These Terms are governed by the laws of the State of New York, without regard to conflict of law principles, unless applicable law requires otherwise.",
            "Before filing a claim, each party agrees to try to resolve the dispute informally by contacting the other party. You may contact us at team@mikeoss.com. If the dispute is not resolved within 30 days, either party may pursue available remedies in a court of competent jurisdiction.",
            "You and Mike agree that claims must be brought only in an individual capacity and not as a plaintiff or class member in any class, collective, consolidated, private attorney general, or representative proceeding, to the maximum extent permitted by law.",
        ],
    },
    {
        title: "20. Electronic Communications",
        body: [
            "By using the Service, you consent to receive communications from us electronically. Electronic communications may include notices, account messages, product updates, and legal disclosures. You agree that electronic communications satisfy any legal requirement that such communications be in writing.",
        ],
    },
    {
        title: "21. Contact",
        body: [
            "If you have questions about these Terms, contact us at team@mikeoss.com.",
        ],
    },
];

export default function TermsPage() {
    return (
        <main className="w-full px-6 py-6 md:py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-medium font-eb-garamond mb-3">
                    Terms of Service
                </h1>
                <p className="mb-6 text-sm text-gray-500">
                    Last Updated: {lastUpdated}
                </p>
                <div className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-900 mb-1">
                        Demo service notice
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                        Mike hosted on MikeOSS.com is currently provided as a
                        demo service. Do not upload, submit, or store
                        sensitive, confidential, privileged, proprietary,
                        client, or personally identifiable documents or
                        information through the Service.
                    </p>
                </div>
                <div className="space-y-7">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="text-xl font-medium mb-3">
                                {section.title}
                            </h2>
                            <div className="space-y-3">
                                {section.body.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="text-sm text-gray-700 leading-relaxed"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
