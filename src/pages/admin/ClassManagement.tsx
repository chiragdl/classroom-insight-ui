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
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Video,
  Eye,
  EyeOff,
  Search
} from "lucide-react";

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

const ClassManagement = () => {
  const [classes, setClasses] = useState<ClassEntry[]>(mockClasses);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUrls, setShowUrls] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    classLevel: "",
    sections: [] as string[],
    assignedUser: "",
    streamUrl: "",
  });

  const filteredClasses = classes.filter(c => 
    c.classLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  <TableHead>Class</TableHead>
                  <TableHead>Sections</TableHead>
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
                    <TableCell className="font-medium">{classItem.classLevel}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {classItem.sections.map(section => (
                          <Badge key={section} variant="secondary" className="bg-primary/10 text-primary">
                            {section}
                          </Badge>
                        ))}
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(classItem.id)}
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
    </div>
  );
};

export default ClassManagement;
