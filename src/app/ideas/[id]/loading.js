import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="h-[70vh] px-4 py-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/80">
        <Loader message="Loading idea details..." />
      </div>
    </div>
  );
}