export interface customDashLogicProps {
  type: string;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  italic: string[];
  bold: string[];
  router: any;
  noteViewMode: "view" | "edit";
  setNoteViewMode:
    | React.Dispatch<React.SetStateAction<"view" | "edit">>
    | undefined;
  setEntries: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  setViewDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateNote: React.Dispatch<
    React.SetStateAction<{ isUpdateNote: boolean; noteId: string | null }>
  >;
  id: string;
  setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
  "data-cy"?: string;
  resetForm?: () => void;
  onClick?: () => void;
  DRAFT_KEY?: (db: string) => string;
  dbNameToSearch?: string | undefined;
}
