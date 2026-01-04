import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Zap, 
  Target, 
  Clock, 
  CheckCircle2
} from "lucide-react";

interface Model {
  id: string;
  name: string;
  version: string;
  description: string;
  accuracy: number;
  speed: "fast" | "medium" | "slow";
  isSelected: boolean;
}

const models: Model[] = [
  {
    id: "1",
    name: "YOLOv8",
    version: "v8.0.2",
    description: "Latest YOLO architecture with improved accuracy and speed. Best for real-time detection in classroom environments.",
    accuracy: 98.5,
    speed: "fast",
    isSelected: true,
  },
  {
    id: "2",
    name: "YOLOv5",
    version: "v6.2",
    description: "Proven and stable model with excellent balance of accuracy and computational efficiency.",
    accuracy: 96.2,
    speed: "fast",
    isSelected: false,
  },
  {
    id: "3",
    name: "Faster R-CNN",
    version: "ResNet-101",
    description: "Two-stage detector offering high accuracy for complex scenes with multiple objects.",
    accuracy: 97.8,
    speed: "medium",
    isSelected: false,
  },
  {
    id: "4",
    name: "EfficientDet",
    version: "D4",
    description: "Efficient architecture optimized for edge devices while maintaining high accuracy.",
    accuracy: 95.4,
    speed: "medium",
    isSelected: false,
  },
];

const getSpeedConfig = (speed: string) => {
  switch (speed) {
    case "fast":
      return { color: "bg-success/10 text-success", label: "Fast", icon: Zap };
    case "medium":
      return { color: "bg-accent/10 text-accent", label: "Medium", icon: Clock };
    case "slow":
      return { color: "bg-destructive/10 text-destructive", label: "Slow", icon: Clock };
    default:
      return { color: "bg-muted", label: speed, icon: Clock };
  }
};

const ModelSelection = () => {
  const [selectedModel, setSelectedModel] = useState("1");

  return (
    <div className="min-h-screen">
      <AdminHeader title="Model Selection" subtitle="Choose the detection model for student counting" />
      
      <div className="p-6 space-y-6">
        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model, index) => {
            const speedConfig = getSpeedConfig(model.speed);
            const isSelected = selectedModel === model.id;
            
            return (
              <Card 
                key={model.id}
                className={`cursor-pointer transition-all duration-300 animate-fade-in ${
                  isSelected 
                    ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20" 
                    : "hover:border-primary/50 hover:shadow-md"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedModel(model.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${isSelected ? "gradient-primary shadow-md" : "bg-secondary"}`}>
                        <Cpu className={`w-6 h-6 ${isSelected ? "text-primary-foreground" : "text-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {model.name}
                          <span className="text-sm font-normal text-muted-foreground">{model.version}</span>
                        </CardTitle>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-1 text-primary animate-scale-in">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="mt-3">
                    {model.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    {/* Accuracy Badge */}
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{model.accuracy}% Accuracy</span>
                    </div>
                    
                    {/* Speed Badge */}
                    <Badge className={speedConfig.color}>
                      <speedConfig.icon className="w-3 h-3 mr-1" />
                      {speedConfig.label}
                    </Badge>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Detection Accuracy</span>
                      <span>{model.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary transition-all duration-500"
                        style={{ width: `${model.accuracy}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Currently Selected */}
        <Card className="bg-primary/5 border-primary/20 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Currently Active Model</p>
                  <p className="text-sm text-muted-foreground">
                    {models.find(m => m.id === selectedModel)?.name} - {models.find(m => m.id === selectedModel)?.version}
                  </p>
                </div>
              </div>
              <Button variant="gradient">
                Apply Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelSelection;
