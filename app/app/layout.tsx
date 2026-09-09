import { AppStateProvider } from "@/lib/app-state-context";
import { BottomNav } from "@/components/app/shell/BottomNav";
import { AmbientMusic } from "@/components/app/shell/AmbientMusic";
import { RachaMilestoneModal } from "@/components/app/RachaMilestoneModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <AmbientMusic />
      <RachaMilestoneModal />
      <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col bg-surface-base">
        <div className="flex-1 overflow-y-auto pb-4">{children}</div>
        <BottomNav />
      </div>
    </AppStateProvider>
  );
}
