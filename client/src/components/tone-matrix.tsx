import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Smile, ServerCog, Lightbulb, Loader2 } from "lucide-react";
import type { ToneAdjustmentRequest, ToneAdjustmentResponse } from "@shared/schema";

interface ToneMatrixProps {
  text: string;
  sessionId: string;
  onToneChange: (modifiedText: string, toneType: string) => void;
}

const toneOptions = [
  {
    id: "formal-professional",
    name: "Formal",
    description: "Professional & polished",
    icon: Briefcase,
    iconColor: "text-blue-600"
  },
  {
    id: "casual-friendly",
    name: "Casual",
    description: "Friendly & approachable",
    icon: Smile,
    iconColor: "text-green-600"
  },
  {
    id: "technical-precise",
    name: "Technical",
    description: "Precise & detailed",
    icon: ServerCog,
    iconColor: "text-purple-600"
  },
  {
    id: "creative-engaging",
    name: "Creative",
    description: "Engaging & vivid",
    icon: Lightbulb,
    iconColor: "text-orange-600"
  }
];

export function ToneMatrix({ text, sessionId, onToneChange }: ToneMatrixProps) {
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const { toast } = useToast();

  const toneAdjustmentMutation = useMutation({
    mutationFn: async (data: ToneAdjustmentRequest): Promise<ToneAdjustmentResponse> => {
      const response = await apiRequest("POST", "/api/tone-adjustment", data);
      return response.json();
    },
    onSuccess: (data) => {
      onToneChange(data.modifiedText, data.toneType);
      setSelectedTone(null);
      toast({
        title: "Tone adjusted successfully",
        description: `Applied: ${toneOptions.find(t => t.id === data.toneType)?.name} style`,
      });
    },
    onError: (error) => {
      setSelectedTone(null);
      toast({
        title: "Failed to adjust tone",
        description: error instanceof Error ? error.message : "Please check your connection and try again",
        variant: "destructive",
      });
    }
  });

  const handleToneSelect = (toneType: string) => {
    if (!text.trim()) {
      toast({
        title: "No text to process",
        description: "Please enter some text before adjusting the tone",
        variant: "destructive",
      });
      return;
    }

    setSelectedTone(toneType);
    toneAdjustmentMutation.mutate({
      text: text.trim(),
      toneType: toneType as any,
      sessionId
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {toneOptions.map((tone) => {
        const Icon = tone.icon;
        const isProcessing = selectedTone === tone.id && toneAdjustmentMutation.isPending;
        
        return (
          <Button
            key={tone.id}
            variant="outline"
            className="h-auto p-4 flex flex-col items-start space-y-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:transform hover:-translate-y-0.5"
            onClick={() => handleToneSelect(tone.id)}
            disabled={toneAdjustmentMutation.isPending}
            data-testid={`button-tone-${tone.id}`}
          >
            <div className="flex items-center justify-between w-full">
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <Icon className={`w-5 h-5 ${tone.iconColor}`} />
              )}
              <div className="w-3 h-3 border-2 border-border rounded-full group-hover:border-primary"></div>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-foreground">{tone.name}</h3>
              <p className="text-sm text-muted-foreground">{tone.description}</p>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
