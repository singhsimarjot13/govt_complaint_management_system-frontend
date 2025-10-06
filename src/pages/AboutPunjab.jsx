import React, { useEffect } from 'react';
import '../theme/punjab-theme.css';

export default function AboutPunjab() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-punjab-indigo text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold">About Punjab</h1>
          <p className="text-white/80 mt-2">Heritage, governance, and public services overview</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="punjab-card p-6">
          <h2 className="text-2xl font-bold punjab-text-primary mb-3">Punjab State Civic Issue Reporting Portal</h2>
          <p className="text-gray-700">
            This portal enables citizens across Punjab to report civic issues directly to their local administration. 
            Issues are verified by councillors, prioritized by MC Admins, and resolved by the relevant departments and workers.
            Dashboards provide transparency and live analytics to promote efficient governance.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="punjab-card p-6">
            <h3 className="text-xl font-semibold punjab-text-primary mb-2">Districts and MC Admins</h3>
            <p className="text-gray-700">Each district has an MC Admin responsible for prioritization and department coordination.</p>
          </div>
          <div className="punjab-card p-6">
            <h3 className="text-xl font-semibold punjab-text-primary mb-2">Councillors & Wards</h3>
            <p className="text-gray-700">Councillors verify issues and represent wards for local grievance redressal.</p>
          </div>
          <div className="punjab-card p-6">
            <h3 className="text-xl font-semibold punjab-text-primary mb-2">Departments & Workers</h3>
            <p className="text-gray-700">Departments and their workers execute on-ground resolution and updates.</p>
          </div>
        </section>

        <section className="punjab-card p-6">
  <h3 className="text-xl font-semibold punjab-text-primary mb-2">About Punjab Portal</h3>
  <ul className="list-disc list-inside text-gray-700 space-y-1">
    <li>Provides a platform for citizens to submit complaints and grievances</li>
    <li>Ensures transparency and accountability in local governance</li>
    <li>Tracks status of submitted complaints in real-time</li>
    <li>Offers easy access to municipal, district, and state-level departments</li>
    <li>Aims to improve civic services and responsiveness across Punjab</li>
  </ul>
</section>

      </main>

      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600">
          © Punjab State Civic Issue Reporting Portal
        </div>
      </footer>
    </div>
  );
}


