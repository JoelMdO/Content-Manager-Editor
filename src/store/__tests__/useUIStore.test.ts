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

  it("initDialogRefs replaces stub refs with real ref objects", () => {
    const mockSectionsRef = {
      current: document.createElement("dialog") as HTMLDialogElement | null,
    };
    const mockSummaryRef = {
      current: document.createElement("dialog") as HTMLDialogElement | null,
    };

    useUIStore.getState().initDialogRefs({
      dialogRef: { current: null },
      sectionsDialogRef: mockSectionsRef,
      summaryDialogRef: mockSummaryRef,
      stylesDialogRef: { current: null },
    });

    expect(useUIStore.getState().sectionsDialogRef).toBe(mockSectionsRef);
    expect(useUIStore.getState().summaryDialogRef).toBe(mockSummaryRef);
  });
});
