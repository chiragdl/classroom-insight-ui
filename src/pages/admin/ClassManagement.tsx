import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Video,
  Eye,
  EyeOff,
  Search,
  Wifi,
  WifiOff,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface ClassEntry {
  id: string;
  classLevel: string;
  sections: string[];
  assignedUser: string;
  streamUrl: string;
  status: "active" | "inactive";
}

const mockClasses: ClassEntry[] = [
  { id: "1", classLevel: "Class 10", sections: ["A", "B"], assignedUser: "Mr. Johnson", streamUrl: "rtsp://192.168.1.100:554/stream1", status: "active" },
  { id: "2", classLevel: "Class 9", sections: ["A"], assignedUser: "Ms. Smith", streamUrl: "rtsp://192.168.1.101:554/stream2", status: "active" },
  { id: "3", classLevel: "Class 8", sections: ["A", "B", "C"], assignedUser: "Mr. Williams", streamUrl: "rtsp://192.168.1.102:554/stream3", status: "inactive" },
  { id: "4", classLevel: "Class 12", sections: ["A"], assignedUser: "Dr. Brown", streamUrl: "rtsp://192.168.1.103:554/stream4", status: "active" },
];

const classLevels = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const sectionOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface FlattenedClassEntry {
  id: string;
  originalId: string;
  classLevel: string;
  section: string;
  assignedUser: string;
  streamUrl: string;
  status: "active" | "inactive";
}

const ClassManagement = () => {
  const [classes, setClasses] = useState<ClassEntry[]>(mockClasses);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUrls, setShowUrls] = useState<Record<string, boolean>>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FlattenedClassEntry | null>(null);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<FlattenedClassEntry | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    classLevel: "",
    sections: [] as string[],
    assignedUser: "",
    streamUrl: "",
  });

  const [editFormData, setEditFormData] = useState({
    assignedUser: "",
    streamUrl: "",
    status: "active" as "active" | "inactive",
  });

  // Flatten classes so each section is a separate row
  const flattenedClasses: FlattenedClassEntry[] = classes.flatMap(c => 
    c.sections.map((section) => ({
      id: `${c.id}-${section}`,
      originalId: c.id,
      classLevel: c.classLevel,
      section: section,
      assignedUser: c.assignedUser,
      streamUrl: c.streamUrl,
      status: c.status,
    }))
  );

  const filteredClasses = flattenedClasses.filter(c => 
    c.classLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.assignedUser.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUrlVisibility = (id: string) => {
    setShowUrls(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskUrl = (url: string) => {
    return url.replace(/\/\/.*@/, "//***:***@").replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, "***.***.***");
  };

  const handleDelete = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const handleEditClick = (entry: FlattenedClassEntry) => {
    setEditingEntry(entry);
    setEditFormData({
      assignedUser: entry.assignedUser,
      streamUrl: entry.streamUrl,
      status: entry.status,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingEntry) return;
    
    setClasses(prev => prev.map(c => {
      if (c.id === editingEntry.originalId) {
        return {
          ...c,
          assignedUser: editFormData.assignedUser,
          streamUrl: editFormData.streamUrl,
          status: editFormData.status,
        };
      }
      return c;
    }));
    
    setEditDialogOpen(false);
    setEditingEntry(null);
  };

  const handleCameraClick = (entry: FlattenedClassEntry) => {
    setSelectedCamera(entry);
    setCameraDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Stream URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Class Management" subtitle="Manage classes, sections, and stream assignments" />
      
      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search classes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" />
            Add New Class
          </Button>
        </div>

        {/* Add Class Form */}
        {showForm && (
          <Card className="animate-scale-in border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Add New Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Class Level</Label>
                  <Select 
                    value={formData.classLevel}
                    onValueChange={(value) => setFormData({...formData, classLevel: value})}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {classLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sections</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select sections" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {sectionOptions.slice(0, 10).map(section => (
                        <SelectItem key={section} value={section}>Section {section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assign User</Label>
                  <Input 
                    placeholder="Teacher name"
                    value={formData.assignedUser}
                    onChange={(e) => setFormData({...formData, assignedUser: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Streaming URL</Label>
                  <Input 
                    placeholder="rtsp://..."
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({...formData, streamUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="gradient">
                  Save Class
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Class & Section</TableHead>
                  <TableHead>Assigned User</TableHead>
                  <TableHead>Streaming URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((classItem, index) => (
                  <TableRow 
                    key={classItem.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{classItem.classLevel}</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Section {classItem.section}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{classItem.assignedUser}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-secondary px-2 py-1 rounded">
                          {showUrls[classItem.id] ? classItem.streamUrl : maskUrl(classItem.streamUrl)}
                        </code>
                        <button 
                          onClick={() => toggleUrlVisibility(classItem.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showUrls[classItem.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={classItem.status === "active" ? "default" : "secondary"}
                        className={classItem.status === "active" ? "bg-success text-success-foreground" : ""}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${classItem.status === "active" ? "bg-success-foreground animate-pulse" : "bg-muted-foreground"}`} />
                        {classItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleCameraClick(classItem)}
                        >
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditClick(classItem)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(classItem.originalId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Class Details</DialogTitle>
            <DialogDescription>
              {editingEntry && `${editingEntry.classLevel} - Section ${editingEntry.section}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assigned User</Label>
              <Input 
                value={editFormData.assignedUser}
                onChange={(e) => setEditFormData({...editFormData, assignedUser: e.target.value})}
                placeholder="Teacher name"
              />
            </div>
            <div className="space-y-2">
              <Label>Camera / Streaming URL</Label>
              <Input 
                value={editFormData.streamUrl}
                onChange={(e) => setEditFormData({...editFormData, streamUrl: e.target.value})}
                placeholder="rtsp://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={editFormData.status}
                onValueChange={(value: "active" | "inactive") => setEditFormData({...editFormData, status: value})}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleEditSave}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Preview Dialog */}
      <Dialog open={cameraDialogOpen} onOpenChange={setCameraDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Live Stream Preview
            </DialogTitle>
            <DialogDescription>
              {selectedCamera && `${selectedCamera.classLevel} - Section ${selectedCamera.section}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Video Preview Area */}
            <div className="relative aspect-video bg-secondary/50 rounded-lg overflow-hidden border border-border">
              {selectedCamera?.status === "active" ? (
                <>
                  {/* Placeholder for video - in production, use HLS.js or similar */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Video className="w-8 h-8 text-primary" />
                      </div>
                      <span className="absolute top-0 right-0 w-4 h-4 bg-success rounded-full animate-pulse" />
                    </div>
                    <p className="text-lg font-medium">Stream Ready</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      RTSP streams require a media server to convert to web-compatible format (HLS/WebRTC)
                    </p>
                    <Badge className="mt-3 bg-success/10 text-success">
                      <Wifi className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white mr-1.5" />
                      LIVE
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <WifiOff className="w-8 h-8 text-destructive" />
                  </div>
                  <p className="text-lg font-medium">Stream Offline</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This stream is currently inactive
                  </p>
                  <Badge className="mt-3 bg-destructive/10 text-destructive">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Disconnected
                  </Badge>
                </div>
              )}
            </div>

            {/* Stream Details */}
            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stream URL</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => selectedCamera && copyToClipboard(selectedCamera.streamUrl)}
                >
                  {copied ? <Check className="w-4 h-4 mr-1 text-success" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied" : "Copy URL"}
                </Button>
              </div>
              <code className="block text-xs bg-background p-2 rounded border break-all">
                {selectedCamera?.streamUrl}
              </code>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs text-muted-foreground">Assigned To</span>
                  <p className="font-medium">{selectedCamera?.assignedUser}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Status</span>
                  <p className="font-medium capitalize">{selectedCamera?.status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setCameraDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassManagement;
