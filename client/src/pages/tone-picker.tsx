import { useState, useEffect } from "react";
import { TextEditor } from "@/components/text-editor";
import { ToneControls } from "@/components/tone-controls";
import { useTextHistory } from "@/hooks/use-text-history";

export default function TonePicker() {
  const [sessionId, setSessionId] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [originalText, setOriginalText] = useState<string>("");
  
  const {
    history,
    currentIndex,
    canUndo,
    canRedo,
    addToHistory,
    undo,
    redo,
    reset
  } = useTextHistory();

  // Generate session ID on mount
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tone-picker-text');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setText(data.text || "");
        setOriginalText(data.originalText || "");
      } catch (error) {
        console.error('Failed to load saved text:', error);
      }
    }
  }, []);

  // Save to localStorage when text changes
  useEffect(() => {
    if (text) {
      localStorage.setItem('tone-picker-text', JSON.stringify({
        text,
        originalText: originalText || text,
        timestamp: Date.now()
      }));
    }
  }, [text, originalText]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (!originalText) {
      setOriginalText(newText);
    }
  };

  const handleToneChange = (modifiedText: string, toneType: string) => {
    const previousText = text;
    setText(modifiedText);
    addToHistory({
      text: modifiedText,
      previousText,
      toneType,
      timestamp: Date.now()
    });
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setText(previousState.text);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setText(nextState.text);
    }
  };

  const handleReset = () => {
    setText(originalText);
    reset();
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characterCount = text.length;
  const lineCount = text.split('\n').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-palette text-primary-foreground text-sm"></i>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Tone Picker</h1>
              <span className="text-sm text-muted-foreground">Text Tone Adjustment Tool</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">API Connected</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span data-testid="word-count">{wordCount}</span> words
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Text Editor Section */}
          <div className="lg:col-span-3">
            <TextEditor
              text={text}
              onTextChange={handleTextChange}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
              wordCount={wordCount}
              characterCount={characterCount}
              lineCount={lineCount}
            />
          </div>

          {/* Tone Controls Section */}
          <div className="lg:col-span-2">
            <ToneControls
              text={text}
              sessionId={sessionId}
              onToneChange={handleToneChange}
              onReset={handleReset}
              history={history}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 Tone Picker</span>
              <span>•</span>
              <span>Powered by Mistral AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <i className="fas fa-question-circle mr-1"></i>
                Help
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <i className="fas fa-cog mr-1"></i>
                Settings
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
