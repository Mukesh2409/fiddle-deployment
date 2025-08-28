import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Undo, Redo } from "lucide-react";

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  wordCount: number;
  characterCount: number;
  lineCount: number;
}

export function TextEditor({
  text,
  onTextChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  wordCount,
  characterCount,
  lineCount
}: TextEditorProps) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Editor Header */}
      <div className="bg-muted/30 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Text Editor</h2>
          
          {/* Undo/Redo Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              data-testid="button-undo"
              className="text-muted-foreground"
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              data-testid="button-redo"
              className="text-muted-foreground"
            >
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
          </div>
        </div>
      </div>

      {/* Text Area */}
      <div className="p-6">
        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full h-96 resize-none border-input"
          data-testid="textarea-main"
        />
      </div>

      {/* Editor Footer */}
      <div className="bg-muted/30 border-t border-border px-6 py-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Characters: <span className="font-medium" data-testid="text-character-count">{characterCount.toLocaleString()}</span></span>
            <span>Lines: <span className="font-medium" data-testid="text-line-count">{lineCount}</span></span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-check-circle text-green-500"></i>
            <span>Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
