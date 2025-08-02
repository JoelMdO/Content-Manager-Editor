import text from "../../constants/dasboardPage_data_text.json";
const AutoSaveScreen = ({ lastAutoSave }: { lastAutoSave: Date | null }) => {
  return (
    <div
      className="flex text-xs text-gray w-auto h-auto p-1 rounded-2xl"
      data-cy="auto-save-indicator"
    >
      {text.autosave.last_auto_save} {lastAutoSave?.toLocaleTimeString()}
    </div>
  );
};

export default AutoSaveScreen;
