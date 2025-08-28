import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface StatusCardProps {
  history: Array<{
    text: string;
    previousText: string;
    toneType: string;
    timestamp: number;
  }>;
}

const toneDisplayNames = {
  "formal-professional": "Formal",
  "casual-friendly": "Casual",
  "technical-precise": "Technical",
  "creative-engaging": "Creative"
};

export function StatusCard({ history }: StatusCardProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastProcessedTone, setLastProcessedTone] = useState<string | null>(null);

  useEffect(() => {
    if (history.length > 0) {
      const latest = history[0];
      setLastProcessedTone(latest.toneType);
      setShowSuccess(true);
      
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [history]);

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getTransitionText = (item: typeof history[0], index: number) => {
    const currentTone = toneDisplayNames[item.toneType as keyof typeof toneDisplayNames];
    
    if (index === history.length - 1) {
      return `Original → ${currentTone}`;
    }
    
    const previousTone = toneDisplayNames[history[index + 1]?.toneType as keyof typeof toneDisplayNames];
    return `${previousTone} → ${currentTone}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="bg-muted/30 border-b border-border px-6 py-4">
        <h3 className="text-lg font-medium text-foreground">Processing Status</h3>
      </div>

      <div className="p-6">
        {/* Success State */}
        {showSuccess && lastProcessedTone && (
          <div className="fade-in mb-4" data-testid="status-success">
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Tone adjusted successfully</p>
                <p className="text-xs text-green-700">
                  Applied: {toneDisplayNames[lastProcessedTone as keyof typeof toneDisplayNames]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Default State */}
        {!showSuccess && (
          <div className="flex items-center space-x-3 p-4 bg-muted/50 border border-border rounded-lg">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Ready to process</p>
              <p className="text-xs text-muted-foreground">Select a tone to adjust your text</p>
            </div>
          </div>
        )}

        {/* History Preview */}
        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Recent Changes</h4>
            <div className="space-y-2">
              {history.slice(0, 3).map((item, index) => (
                <div key={`${item.timestamp}-${index}`} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span data-testid={`history-time-${index}`}>{formatTimeAgo(item.timestamp)}</span>
                  </span>
                  <span className="font-medium" data-testid={`history-transition-${index}`}>
                    {getTransitionText(item, index)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
