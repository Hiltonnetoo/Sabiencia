import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { mailtoHref, whatsappHref, DEMO_HOME } from './landing.config';

const ContactSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-blue-600 px-6 py-12 lg:px-16 lg:py-16 text-center text-white shadow-xl">
          <Badge
            variant="outline"
            className="mb-4 bg-white/10 border-white/20 text-white"
          >
            {t('landing.contact.badge')}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('landing.contact.title')}
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto mb-8">
            {t('landing.contact.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg"
            >
              <a href={mailtoHref}>
                <Mail className="w-5 h-5 mr-2" />
                {t('landing.contact.emailCta')}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('landing.contact.whatsappCta')}
              </a>
            </Button>
          </div>

          <p className="mt-8 text-sm text-blue-100">
            <Link
              to={DEMO_HOME}
              className="inline-flex items-center font-medium text-white underline underline-offset-4 hover:text-blue-50"
            >
              {t('landing.contact.demoHint')}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
