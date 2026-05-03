import { Helmet } from "react-helmet-async";

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Helmet>
        <title>Privacy Policy | ElectIQ</title>
      </Helmet>
      <h1 className="text-4xl font-black text-white mb-8 tracking-tighter font-display">
        Privacy Policy
      </h1>
      <div className="space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Introduction</h2>
          <p>
            ElectIQ is committed to protecting your privacy. This policy explains how we handle your data
            when you use our election intelligence toolkit.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Data Collection</h2>
          <p>
            We collect minimal personal data. If you choose to sign in, we use Firebase Authentication
            to manage your profile. We do not sell your personal information to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">AI Conversations</h2>
          <p>
            Conversations with the ElectIQ AI assistant are processed by Google Gemini. While we store
            a limited history locally on your device for your convenience, we do not use your personal 
            chat data for training purposes.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Cookies</h2>
          <p>
            We use essential cookies to maintain your session and preferences (such as your selected 
            country and role).
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
