import useCoupleConfig from "../hooks/useCoupleConfig.js";
import Timeline from "./Timeline.jsx";
import LoveLetter from "./LoveLetter.jsx";
import QuizGame from "./QuizGame.jsx";
import ReasonsJar from "./ReasonsJar.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import PromiseBuilder from "./PromiseBuilder.jsx";
import Playlist from "./Playlist.jsx";

// Maps every non-proposal mode to its component (proposal has its own
// scene + hook, see components/proposal/).
export default function ModeContent({ mode, onProgress }) {
  const config = useCoupleConfig();
  switch (mode) {
    case "timeline":
      return <Timeline data={config.timeline} onProgress={(p) => onProgress("timeline", p)} />;
    case "letter":
      return <LoveLetter data={config.letter} onProgress={(p) => onProgress("letter", p)} />;
    case "quiz":
      return <QuizGame data={config.quiz} results={config.quizResults} onProgress={(p) => onProgress("quiz", p)} />;
    case "jar":
      return <ReasonsJar data={config.reasons} onProgress={(p) => onProgress("jar", p)} />;
    case "gallery":
      return <PhotoGallery data={config.gallery} onProgress={(p) => onProgress("gallery", p)} />;
    case "promises":
      return <PromiseBuilder data={config.promises} title={config.promiseTitle} subtitle={config.promiseSubtitle} onProgress={(p) => onProgress("promises", p)} />;
    case "playlist":
      return <Playlist data={config.playlist} />;
    default:
      return null;
  }
}
