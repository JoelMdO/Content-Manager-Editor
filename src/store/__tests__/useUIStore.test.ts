// =============================================================
// Unit tests for useUIStore
// =============================================================

import { useUIStore } from "../useUIStore";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      isMediumScreen: false,
      selectedSection: "Select category",
      openDialogNoSection: false,
      isSummary: false,
      summaryContent: "",
      isView: false,
      previewReady: false,
      isLoadingPreview: false,
      lastAutoSave: null,
    });
  });

  it("initialises with default values", () => {
    const s = useUIStore.getState();
    expect(s.selectedSection).toBe("Select category");
    expect(s.openDialogNoSection).toBe(false);
    expect(s.previewReady).toBe(false);
    expect(s.lastAutoSave).toBeNull();
  });

  it("setOpenDialogNoSection toggles the sections-required dialog", () => {
    useUIStore.getState().setOpenDialogNoSection(true);
    expect(useUIStore.getState().openDialogNoSection).toBe(true);

    useUIStore.getState().setOpenDialogNoSection(false);
    expect(useUIStore.getState().openDialogNoSection).toBe(false);
  });

  it("setPreviewReady switches between editor and preview", () => {
    useUIStore.getState().setPreviewReady(true);
    expect(useUIStore.getState().previewReady).toBe(true);
  });

  it("setSelectedSection updates the chosen article section", () => {
    useUIStore.getState().setSelectedSection("Technology");
    expect(useUIStore.getState().selectedSection).toBe("Technology");
  });

  it("setSummaryContent stores AI-generated summary text", () => {
    useUIStore.getState().setSummaryContent("This is a summary.");
    expect(useUIStore.getState().summaryContent).toBe("This is a summary.");
  });

  it("setLastAutoSave stores the save timestamp", () => {
    const now = new Date();
    useUIStore.getState().setLastAutoSave(now);
    expect(useUIStore.getState().lastAutoSave).toBe(now);
  });

  it("initDialogRefs mutates .current on stable refs without replacing the objects", () => {
    const dialogElement = document.createElement("dialog") as HTMLDialogElement;
    const sectionsElement = document.createElement(
      "dialog",
    ) as HTMLDialogElement;

    // Capture the stable ref objects before calling initDialogRefs
    const stableDialogRef = useUIStore.getState().dialogRef;
    const stableSectionsRef = useUIStore.getState().sectionsDialogRef;

    useUIStore.getState().initDialogRefs({
      dialogRef: { current: dialogElement },
      sectionsDialogRef: { current: sectionsElement },
      summaryDialogRef: { current: null },
      stylesDialogRef: { current: null },
    });

    const state = useUIStore.getState();

    // The ref objects must be the same stable instances — not replaced
    expect(state.dialogRef).toBe(stableDialogRef);
    expect(state.sectionsDialogRef).toBe(stableSectionsRef);

    // Only .current should have been updated
    expect(state.dialogRef.current).toBe(dialogElement);
    expect(state.sectionsDialogRef.current).toBe(sectionsElement);

    // null values passed in must not overwrite an already-set .current
    expect(state.summaryDialogRef.current).toBeNull();
    expect(state.stylesDialogRef.current).toBeNull();
  });
});
