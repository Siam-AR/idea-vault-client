import Link from 'next/link';
import { Button, Card } from '@heroui/react';
import { FaBookOpen, FaCheckCircle, FaRegLightbulb } from 'react-icons/fa';

const guides = [
  {
    icon: FaBookOpen,
    title: 'Project Guide',
    text: 'Shape a clear project description, set priorities, and explain who the idea supports.',
  },
  {
    icon: FaCheckCircle,
    title: 'Volunteer Checklist',
    text: 'Prepare a simple checklist so people know how they can help and what happens next.',
  },
  {
    icon: FaRegLightbulb,
    title: 'Outreach Tips',
    text: 'Use short, welcoming language so neighbors, friends, and partners feel invited to join.',
  },
];

export default function ResourcesPage() {
  return (
    <div className="px-4 py-10 md:py-14 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Community Resources</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Helpful starting points for community projects.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            These quick resources help turn an idea into a project people can understand, support, and share.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guide.icon;

            return (
              <Card key={guide.title} className="border border-slate-200 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-amber-500 text-white">
                  <Icon />
                </div>
                <h2 className="mt-5 text-xl font-bold">{guide.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{guide.text}</p>
              </Card>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Ready to share a project?</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Add a community initiative, browse current ideas, or update your profile before you post.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/add-idea">
                <Button variant="primary">Add Project</Button>
              </Link>
              <Link href="/ideas">
                <Button variant="outline">Browse Projects</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}