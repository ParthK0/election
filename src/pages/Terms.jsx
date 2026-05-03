import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Helmet>
        <title>Terms of Service | ElectIQ</title>
      </Helmet>
      <h1 className="text-4xl font-black text-white mb-8 tracking-tighter font-display">
        Terms of Service
      </h1>
      <div className="space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Acceptance of Terms</h2>
          <p>
            By accessing ElectIQ, you agree to be bound by these Terms of Service and all applicable
            laws and regulations.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Educational Purpose</h2>
          <p>
            ElectIQ is an educational tool provided for informational purposes only. While we strive 
            for accuracy, we do not provide legal or official voting advice. Always consult official 
            government sources for final confirmation of electoral procedures.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">AI-Generated Content</h2>
          <p>
            The AI assistant utilizes large language models (Google Gemini). AI can sometimes generate 
            incorrect information. Users should verify critical details with official electoral commissions.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Prohibited Conduct</h2>
          <p>
            Users may not use the service to spread misinformation, harass others, or attempt to 
            interfere with the operation of the application.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
