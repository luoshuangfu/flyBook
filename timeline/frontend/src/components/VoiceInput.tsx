import { useMemo, useState } from "react";

interface VoiceInputProps {
  onSubmit: (title: string) => void;
}

export default function VoiceInput({ onSubmit }: VoiceInputProps) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");

  const SpeechRecognition = useMemo(() => {
    return (
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }, []);

  const handleManualSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  const handleVoice = () => {
    if (!SpeechRecognition) {
      setMessage("当前浏览器不支持语音识别，可改用手动输入。");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setMessage("正在倾听...说出你的任务。");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onSubmit(text.trim());
      setMessage(`已识别：${text}`);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setMessage(`语音识别失败：${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="voice-input">
      <div className="voice-input__row">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="写下或说出当前任务..."
        />
        <button onClick={handleManualSubmit}>开始</button>
        <button onClick={handleVoice} disabled={isListening}>
          {isListening ? "倾听中" : "语音"}
        </button>
      </div>
      {message && <p className="voice-input__hint">{message}</p>}
    </div>
  );
}
