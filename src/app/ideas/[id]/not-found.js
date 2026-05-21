import { Button } from "@heroui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
          404
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">Idea not found</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
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