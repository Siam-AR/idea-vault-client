import { Button } from "@heroui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          404
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Idea not found</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          The idea you opened may have been removed or the link is invalid.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/ideas">
            <Button color="primary">Back to Ideas</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}