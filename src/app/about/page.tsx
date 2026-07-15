import Link from 'next/link';
import { Button, Card } from '@heroui/react';
import { FaHandsHelping, FaLeaf, FaUsers } from 'react-icons/fa';

const principles = [
  {
    icon: FaHandsHelping,
    title: 'Practical collaboration',
    text: 'Community Spark helps people explain a need clearly and gather support around it quickly.',
  },
  {
    icon: FaUsers,
    title: 'People-first participation',
    text: 'Every page encourages neighbors, volunteers, and organizers to join the same project conversation.',
  },
  {
    icon: FaLeaf,
    title: 'Local impact',
    text: 'The platform focuses on initiatives that improve education, health, environment, and community wellbeing.',
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-10 md:py-14 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">About Community Spark</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">A place for community ideas, support, and shared action.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Community Spark helps people turn local needs into organized projects. It keeps the structure of a full-stack idea platform,
            but the focus is on practical community work, neighborhood improvement, and meaningful collaboration.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ideas">
              <Button variant="primary">Browse Projects</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="border border-slate-200 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-amber-500 text-white">
                  <Icon />
                </div>
                <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}