import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-8 bg-gradient-primary rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PRIVACY POLICY
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
              At Infinity Predictive, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our prediction markets platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center">
                <Database className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">2. Information We Collect</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed mb-4">
              We collect the following types of information:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Wallet Information</h3>
                <ul className="list-disc list-inside text-foreground-muted space-y-1 ml-4">
                  <li>Wallet addresses (public keys only)</li>
                  <li>Transaction history on our platform</li>
                  <li>Network information (Polygon, etc.)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                <ul className="list-disc list-inside text-foreground-muted space-y-1 ml-4">
                  <li>Pages visited and features used</li>
                  <li>Betting activity and preferences</li>
                  <li>Market interactions and selections</li>
                  <li>Device and browser information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Technical Data</h3>
                <ul className="list-disc list-inside text-foreground-muted space-y-1 ml-4">
                  <li>IP addresses (for security and analytics)</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">3. How We Use Your Information</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li>Provide and maintain our prediction markets platform</li>
              <li>Process transactions and manage betting activities</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Improve user experience and platform functionality</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-error rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">4. Information Sharing and Disclosure</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform (hosting, analytics, security)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Security:</strong> To protect against fraud, abuse, or security threats</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">5. Data Security</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication measures</li>
              <li>Secure development practices and code reviews</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-bold mb-4">6. Data Retention</h2>
            <p className="text-foreground-muted leading-relaxed mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li>Provide our services and maintain your account</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our platform and services</li>
            </ul>
            <p className="text-foreground-muted leading-relaxed mt-4">
              When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-bold mb-4">7. Your Rights</h2>
            <p className="text-foreground-muted leading-relaxed mb-4">
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
            </ul>
            <p className="text-foreground-muted leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-xl font-bold mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-foreground-muted leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content and features</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
            <p className="text-foreground-muted leading-relaxed mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-xl font-bold mb-4">9. Third-Party Services</h2>
            <p className="text-foreground-muted leading-relaxed mb-4">
              Our platform integrates with third-party services:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
              <li><strong>Azuro:</strong> For prediction markets data and smart contracts</li>
              <li><strong>Wallet Providers:</strong> MetaMask, WalletConnect, Phantom</li>
              <li><strong>Analytics:</strong> To understand platform usage</li>
              <li><strong>Hosting:</strong> For platform infrastructure</li>
            </ul>
            <p className="text-foreground-muted leading-relaxed mt-4">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-accent-cyan rounded-full flex items-center justify-center">
                <Globe className="h-4 w-4 text-background" />
              </div>
              <h2 className="text-xl font-bold">10. International Data Transfers</h2>
            </div>
            <p className="text-foreground-muted leading-relaxed">
              Our platform operates globally, and your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-bold mb-4">11. Children's Privacy</h2>
            <p className="text-foreground-muted leading-relaxed">
              Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-foreground-muted leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date. Your continued use of our platform after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-bold mb-4">13. Contact Us</h2>
            <p className="text-foreground-muted leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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
