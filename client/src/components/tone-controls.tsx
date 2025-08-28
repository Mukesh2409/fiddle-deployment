import { ToneMatrix } from "@/components/tone-matrix";
import { StatusCard } from "@/components/status-card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ToneControlsProps {
  text: string;
  sessionId: string;
  onToneChange: (modifiedText: string, toneType: string) => void;
  onReset: () => void;
  history: Array<{
    text: string;
    previousText: string;
    toneType: string;
    timestamp: number;
  }>;
}

export function ToneControls({ 
  text, 
  sessionId, 
  onToneChange, 
  onReset, 
  history 
}: ToneControlsProps) {
  return (
    <div className="space-y-6">
      
      {/* Tone Picker Card */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="bg-muted/30 border-b border-border px-6 py-4">
          <h2 className="text-lg font-medium text-foreground">Tone Adjustment</h2>
          <p className="text-sm text-muted-foreground mt-1">Adjust the tone of your text using the matrix below</p>
        </div>

        <div className="p-6">
          <ToneMatrix
            text={text}
            sessionId={sessionId}
            onToneChange={onToneChange}
          />

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={onReset}
            data-testid="button-reset"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Original
          </Button>
        </div>
      </div>

      <StatusCard history={history} />

      {/* API Info Card */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-blue-600 text-sm"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Mistral AI</h3>
              <p className="text-xs text-muted-foreground">Small Model</p>
            </div>
          </div>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="font-medium">mistral-small-latest</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>Cache enabled:</span>
              <span className="font-medium">Yes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
