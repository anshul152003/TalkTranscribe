import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useState } from "react";

let isActive = false;

function App() {
  const [activeStatus, setActiveStatus] = useState("Speech Recognition Is Not Active");

  const { transcript, resetTranscript } = useSpeechRecognition();

  async function startListening() {
    if (!isActive) {
      try {
        // Request microphone access
        await navigator.mediaDevices.getUserMedia({ audio: true });

        setActiveStatus("Speech Recognition Is Active");
        SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        isActive = true;
      } catch (error) {
        console.error("Microphone permission denied or error occurred:", error);
        setActiveStatus("Microphone permission denied");
      }
    } else {
      setActiveStatus("Speech Recognition Is Not Active");
      isActive = false;
      SpeechRecognition.stopListening();
    }
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  function downloadTranscript() {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcript.txt";
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black rounded-lg shadow-lg">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Speech To Text</h2>
          <p className="text-white text-sm">Convert your speech to text with ease.</p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={startListening}
            className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition"
          >
            Start/Stop
          </button>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={resetTranscript}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Clear
            </button>

            <button
              onClick={() => copy(transcript)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Copy
            </button>

            <button
              onClick={downloadTranscript}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Download
            </button>
          </div>
        </div>

        <textarea
          value={transcript}
          className="w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-400 border-gray-600"
          placeholder="Your speech will appear here..."
          rows="6"
          readOnly
        ></textarea>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-white text-sm">{activeStatus}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
