import Link from 'next/link';
import { Button, Card } from '@heroui/react';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const contactOptions = [
  {
    icon: FaEnvelope,
    title: 'Email',
    value: 'hello@communityspark.org',
    href: 'mailto:hello@communityspark.org',
  },
  {
    icon: FaPhoneAlt,
    title: 'Phone',
    value: '+880 1234-567890',
    href: 'tel:+8801234567890',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Location',
    value: 'Dhaka, Bangladesh',
    href: 'https://maps.google.com',
  },
];

export default function ContactPage() {
  return (
    <div className="px-4 py-10 md:py-14 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Contact</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Reach out about a project, idea, or partnership.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Use the contact options below if you want to ask a question, suggest a feature, or talk about a community initiative.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {contactOptions.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="border border-slate-200 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-amber-500 text-white">
                  <Icon />
                </div>
                <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.value}</p>
                <a href={item.href} className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                  Open contact method
                </a>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <Card className="border border-slate-200 p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold">Need help with a project page?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              If you are stuck posting a project or updating your profile, start by browsing the projects page or returning to your account.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/ideas">
                <Button variant="primary">Browse Projects</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">My Profile</Button>
              </Link>
            </div>
          </Card>

          <Card className="border border-slate-200 p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">Follow the project</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Community Spark is built to support local collaboration, so feedback is always welcome.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p>Response window: 1-2 business days</p>
              <p>Best for: project questions, feature requests, and collaboration ideas</p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}