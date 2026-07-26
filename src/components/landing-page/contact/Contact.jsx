import React from 'react';
import SectionHeader from '../../ui/SectionHeader';
import { useContact } from '../../../hooks/useContact';

const Contact = () => {
  const { contact: contactData, loading } = useContact();

  if (loading) {
    return (
      <section id="contact" className="py-20 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface-card flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full animate-spin"></div>
      </section>
    );
  }

  const contactItems = [
    { title: "Alamat Kantor", value: contactData.address },
    { title: "Telepon / WA", value: contactData.phone },
    { title: "Website", value: contactData.website }
  ];

  return (
    <section id="contact" className="py-20 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface-card">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section (without pillText) */}
        <SectionHeader 
          title={contactData.title}
          description={contactData.description}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Contact List */}
          <div className="flex-1 flex flex-col gap-4">
            {contactItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-transparent border border-gray-200 rounded-xl p-5 flex items-start gap-3"
              >
                <div className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0"></div>
                <div>
                  <h4 className="font-jakarta font-semibold text-accent text-sm mb-1">
                    {item.title}
                  </h4>
                  <p className="font-jakarta text-brand text-sm sm:text-base leading-relaxed">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Map */}
          <div className="flex-1 min-h-[300px]">
            <div className="relative w-full h-full min-h-[300px] lg:min-h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <iframe 
                src={contactData.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
