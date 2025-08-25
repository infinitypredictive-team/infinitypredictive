import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Shield, Scale, Users, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-8 bg-gradient-primary rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TERMS OF SERVICE
            </h1>
          </div>
          <p className="text-foreground-muted">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="glass-card space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">1. Introduction</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed">
              Welcome to Infinity Predictive. These Terms of Service govern your use of our prediction markets platform powered by Azuro. By accessing or using our service, you agree to be bound by these terms.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">2. Service Description</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed mb-4">
              Infinity Predictive is a decentralized prediction markets platform that allows users to trade on the outcomes of real-world events. Our platform:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li>Provides access to prediction markets for sports, elections, crypto, entertainment, and other events</li>
              <li>Offers real-time odds and liquidity data sourced from Azuro</li>
              <li>Enables users to place bets using cryptocurrency wallets</li>
              <li>Provides automated settlement and payouts based on market outcomes</li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center">
                <Scale className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">3. Eligibility</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed mb-4">
              To use Infinity Predictive, you must:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li>Be at least 18 years old</li>
              <li>Comply with all applicable laws and regulations in your jurisdiction</li>
              <li>Not be located in a jurisdiction where prediction markets are prohibited</li>
              <li>Have the legal capacity to enter into binding agreements</li>
            </ul>
          </section>

          {/* Risk Disclosure */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-error rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">4. Risk Disclosure</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed mb-4">
              Prediction markets involve significant risk. You acknowledge that:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li>You may lose some or all of your invested funds</li>
              <li>Market outcomes are unpredictable and not guaranteed</li>
              <li>Cryptocurrency values are volatile and can fluctuate rapidly</li>
              <li>Technical issues, network problems, or smart contract bugs may affect your ability to trade or receive payouts</li>
              <li>Regulatory changes may impact the availability or legality of prediction markets</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-xl font-bold mb-4">5. User Responsibilities</h2>
            <p className="text-foreground-muted leading-relaxed mb-4">
              As a user of Infinity Predictive, you agree to:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the security of your wallet and private keys</li>
              <li>Not engage in market manipulation or fraudulent activities</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use the platform for illegal purposes</li>
              <li>Report any bugs or security vulnerabilities you discover</li>
            </ul>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-xl font-bold mb-4">6. Privacy</h2>
            <p className="text-foreground-muted leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. By using our service, you consent to the collection and use of information as described in our Privacy Policy.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold mb-4">7. Intellectual Property</h2>
            <p className="text-foreground-muted leading-relaxed">
              Infinity Predictive and its content, including but not limited to text, graphics, logos, and software, are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-foreground-muted leading-relaxed">
              To the maximum extent permitted by law, Infinity Predictive shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from your use of the platform.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-foreground-muted leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of material changes through the platform or via email. Your continued use of the service after changes become effective constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-bold mb-4">10. Contact Information</h2>
            <p className="text-foreground-muted leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-foreground-muted">
              <p>• Telegram: <a href="https://t.me/infin8tyCoin" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">@infin8tyCoin</a></p>
              <p>• Instagram: <a href="https://www.instagram.com/infinitygaming888" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">@infinitygaming888</a></p>
              <p>• Website: <a href="https://honeydew-hamster-552763.hostingersite.com" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">Infinity Gaming</a></p>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
