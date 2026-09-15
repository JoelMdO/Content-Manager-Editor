const bell = new Audio("/bell.mp3");
const playBell = () => {
  bell.currentTime = 0;
  void bell.play();
};
export default playBell;
