import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PlaybookMeta } from "../../types/plabookMeta";

export interface CustomDashButtonProps {
  type: string;
  onClick: () => void;
  isCreating: boolean;
  id: string;
  setViewDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setEntries: React.Dispatch<React.SetStateAction<PlaybookMeta[] | undefined>>;
  setUpdateNote: React.Dispatch<
    React.SetStateAction<{ isUpdateNote: boolean; noteId: string | null }>
  >;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  "data-cy": string;
  resetForm: () => void;
  router: AppRouterInstance;
  noteViewMode: string;
  setNoteViewMode: React.Dispatch<React.SetStateAction<"view" | "edit">>;
}
