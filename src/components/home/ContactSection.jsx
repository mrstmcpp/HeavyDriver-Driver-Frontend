import React from "react";
import { Button } from "primereact/button";

const ContactSection = () => {
  return (
    <section className="bg-gray-900 px-6 lg:px-20 py-20 border-t border-yellow-600 text-center relative">
      <h3 className="text-3xl font-bold text-yellow-400 mb-10">Get in Touch</h3>

      <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
        Have questions or need help? Our team is available 24/7 to assist you.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-gray-300 mb-10">
        <div className="flex items-center gap-3 hover:text-yellow-400 transition-colors">
          <i className="pi pi-envelope text-yellow-400 text-2xl" />
          <span>support@heavydriver.app</span>
        </div>
        <div className="flex items-center gap-3 hover:text-yellow-400 transition-colors">
          <i className="pi pi-map-marker text-yellow-400 text-2xl" />
          <span>Prayagraj, India</span>
        </div>
        <div className="flex items-center gap-3 hover:text-yellow-400 transition-colors">
          <i className="pi pi-phone text-yellow-400 text-2xl" />
          <span>+91 9452549006</span>
        </div>
      </div>

      <Button
        label="Contact Support"
        icon="pi pi-comments"
        className="p-button-warning text-black font-semibold hover:scale-105 transition-transform duration-300"
        onClick={() => (window.location.href = "mailto:support@heavydriver.in")}
      />
    </section>
  );
};

export default ContactSection;
