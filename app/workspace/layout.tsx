import type { ReactNode } from "react";
import { WorkspaceDialogs } from "@/components/workspace/Dialogs";
import { WorkspaceNav } from "@/components/workspace/WorkspaceNav";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import styles from "@/components/workspace/workspace.module.css";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <div className={styles.page}>
        <WorkspaceNav />
        {children}
        <p className={styles.footerNote}>CardioLink · Fictional patients and illustrative data only · Not for clinical decision-making</p>
        <WorkspaceDialogs />
      </div>
    </WorkspaceProvider>
  );
}
