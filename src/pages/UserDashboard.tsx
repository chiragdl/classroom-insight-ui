import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Video, 
  Cpu, 
  Play, 
  Square, 
  Users, 
  Clock, 
  Target,
  LogOut,
  Wifi,
  WifiOff,
  AlertTriangle,
  Timer
} from "lucide-react";

type StreamStatus = "live" | "ready" | "disconnected";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("ready");
  const [studentCount, setStudentCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);

  // Simulate student counting when running
  useEffect(() => {
    if (isRunning) {
      setStreamStatus("live");
      const countInterval = setInterval(() => {
        setStudentCount(prev => {
          const variation = Math.floor(Math.random() * 3) - 1;
          return Math.max(0, Math.min(35, prev + variation));
        });
      }, 2000);

      const timeInterval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);

      // Initial count
      setStudentCount(Math.floor(Math.random() * 10) + 25);

      return () => {
        clearInterval(countInterval);
        clearInterval(timeInterval);
      };
    }
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setSessionTime(0);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStreamStatus("ready");
    setLastTimestamp(new Date().toLocaleString());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusConfig = (status: StreamStatus) => {
    switch (status) {
      case "live":
        return { color: "bg-destructive", text: "Live", icon: Wifi };
      case "ready":
        return { color: "bg-success", text: "Ready", icon: Wifi };
      case "disconnected":
        return { color: "bg-accent", text: "Disconnected", icon: WifiOff };
    }
  };

  const statusConfig = getStatusConfig(streamStatus);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold">EduCount AI</h1>
            <p className="text-xs text-muted-foreground">Teacher Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Mr. Johnson</p>
            <p className="text-xs text-muted-foreground">Class 10-A</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Assignment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="animate-fade-in">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Class</p>
                <p className="font-semibold">Class 10 - Section A</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Video className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Camera Stream</p>
                <p className="font-semibold">Room 101 - Main</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <Cpu className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Model</p>
                <p className="font-semibold">YOLOv8 v8.0.2</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Stream View */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="relative aspect-video bg-foreground/5">
                {/* Status Indicator */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className={`${statusConfig.color} text-white flex items-center gap-1.5`}>
                    {streamStatus === "live" && (
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                    <statusConfig.icon className="w-3 h-3" />
                    {statusConfig.text}
                  </Badge>
                </div>

                {/* Student Count Overlay */}
                {isRunning && (
                  <div className="absolute top-4 right-4 z-10 animate-scale-in">
                    <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg gradient-primary">
                          <Users className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Students Detected</p>
                          <p className="text-3xl font-bold text-gradient">{studentCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timer Overlay */}
                {isRunning && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <Timer className="w-4 h-4 text-primary" />
                      <span className="font-mono font-medium">{formatTime(sessionTime)}</span>
                    </div>
                  </div>
                )}

                {/* Placeholder Stream */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isRunning ? (
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-pulse-ring" />
                        <div className="absolute inset-4 border-4 border-primary/50 rounded-full animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
                        <div className="absolute inset-8 border-4 border-primary/70 rounded-full animate-pulse-ring" style={{ animationDelay: "1s" }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="w-12 h-12 text-primary" />
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-4">AI Detection Running...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Video className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground mt-4">Stream preview will appear here</p>
                      <p className="text-sm text-muted-foreground/60">Click "Start Counting" to begin</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Control Panel */}
            <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Session Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  {/* Time Inputs */}
                  <div className="flex gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="minutes" className="text-xs text-muted-foreground">Minutes</Label>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="120"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        className="w-20 text-center"
                        disabled={isRunning}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seconds" className="text-xs text-muted-foreground">Seconds</Label>
                      <Input
                        id="seconds"
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        className="w-20 text-center"
                        disabled={isRunning}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:ml-auto">
                    {!isRunning ? (
                      <Button variant="gradient" size="lg" onClick={handleStart}>
                        <Play className="w-4 h-4" />
                        Start Counting
                      </Button>
                    ) : (
                      <Button variant="destructive" size="lg" onClick={handleStop}>
                        <Square className="w-4 h-4" />
                        Stop Session
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Panel */}
          <div className="space-y-4">
            <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Live Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Student Count */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Current Count</span>
                    </div>
                    <span className="text-3xl font-bold text-gradient">{studentCount}</span>
                  </div>
                </div>

                {/* Session Duration */}
                <div className="p-4 rounded-xl bg-secondary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">Session Time</span>
                    </div>
                    <span className="text-xl font-semibold font-mono">{formatTime(sessionTime)}</span>
                  </div>
                </div>

                {/* Detection Confidence */}
                <div className="p-4 rounded-xl bg-secondary">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <Target className="w-5 h-5 text-success" />
                      </div>
                      <span className="text-sm text-muted-foreground">Confidence</span>
                    </div>
                    <span className="text-xl font-semibold">98.5%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success w-[98.5%] transition-all duration-500" />
                  </div>
                </div>

                {/* Last Run */}
                <div className="p-4 rounded-xl bg-secondary">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Timer className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Last Run</span>
                      <span className="text-sm font-medium">
                        {lastTimestamp || "No previous session"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className={`animate-fade-in ${isRunning ? "border-primary/50 shadow-glow-sm" : ""}`} style={{ animationDelay: "600ms" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {isRunning ? (
                    <>
                      <div className="relative">
                        <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping" />
                      </div>
                      <div>
                        <p className="font-medium text-success">Detection Active</p>
                        <p className="text-xs text-muted-foreground">AI is analyzing the stream</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">Ready to Start</p>
                        <p className="text-xs text-muted-foreground">Configure time and start session</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
