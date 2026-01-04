import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Search,
  User,
  GraduationCap,
  X
} from "lucide-react";

interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "invigilator";
  assignedClasses: string[];
  status: "active" | "inactive";
}

const mockUsers: UserEntry[] = [
  { id: "1", name: "Mr. Johnson", email: "johnson@edu.com", role: "teacher", assignedClasses: ["Class 10 A", "Class 10 B"], status: "active" },
  { id: "2", name: "Ms. Smith", email: "smith@edu.com", role: "teacher", assignedClasses: ["Class 9 A"], status: "active" },
  { id: "3", name: "Mr. Williams", email: "williams@edu.com", role: "invigilator", assignedClasses: ["Class 8 A", "Class 8 B", "Class 8 C"], status: "inactive" },
  { id: "4", name: "Dr. Brown", email: "brown@edu.com", role: "teacher", assignedClasses: ["Class 12 A"], status: "active" },
  { id: "5", name: "Mrs. Davis", email: "davis@edu.com", role: "invigilator", assignedClasses: ["Class 11 A", "Class 11 B"], status: "active" },
];

const availableClasses = [
  "Class 8 A", "Class 8 B", "Class 8 C",
  "Class 9 A", "Class 9 B",
  "Class 10 A", "Class 10 B",
  "Class 11 A", "Class 11 B",
  "Class 12 A", "Class 12 B"
];

const UserManagement = () => {
  const [users, setUsers] = useState<UserEntry[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserEntry | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "teacher" as "teacher" | "invigilator",
    assignedClasses: [] as string[],
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.assignedClasses.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleEditClick = (user: UserEntry) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      assignedClasses: [...user.assignedClasses],
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingUser) return;
    
    setUsers(prev => prev.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          assignedClasses: formData.assignedClasses,
        };
      }
      return u;
    }));
    
    setEditDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const handleAddUser = () => {
    const newUser: UserEntry = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      assignedClasses: formData.assignedClasses,
      status: "active",
    };
    setUsers(prev => [...prev, newUser]);
    setShowAddDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "teacher",
      assignedClasses: [],
    });
  };

  const toggleClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(className)
        ? prev.assignedClasses.filter(c => c !== className)
        : [...prev.assignedClasses, className]
    }));
  };

  const removeAssignedClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.filter(c => c !== className)
    }));
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="User Management" subtitle="Manage users and their class assignments" />
      
      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="gradient" onClick={() => { resetForm(); setShowAddDialog(true); }}>
            <Plus className="w-4 h-4" />
            Add New User
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Classes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow 
                    key={user.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {user.assignedClasses.map((cls) => (
                          <Badge key={cls} variant="secondary" className="bg-primary/10 text-primary text-xs">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {cls}
                          </Badge>
                        ))}
                        {user.assignedClasses.length === 0 && (
                          <span className="text-sm text-muted-foreground">No classes assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={user.status === "active" ? "bg-success text-success-foreground" : ""}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === "active" ? "bg-success-foreground animate-pulse" : "bg-muted-foreground"}`} />
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditClick(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(user.id)}
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

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user and assign classes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="User name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="user@edu.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex gap-2">
                <Button 
                  variant={formData.role === "teacher" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({...formData, role: "teacher"})}
                >
                  Teacher
                </Button>
                <Button 
                  variant={formData.role === "invigilator" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({...formData, role: "invigilator"})}
                >
                  Invigilator
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assign Classes (click to select)</Label>
              {formData.assignedClasses.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {formData.assignedClasses.map((cls) => (
                    <Badge key={cls} variant="default" className="flex items-center gap-1">
                      {cls}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeAssignedClass(cls)} />
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 border rounded-md">
                {availableClasses.map((cls) => (
                  <Badge 
                    key={cls} 
                    variant={formData.assignedClasses.includes(cls) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => toggleClass(cls)}
                  >
                    {cls}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleAddUser}>
              Add User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and class assignments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="User name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="user@edu.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex gap-2">
                <Button 
                  variant={formData.role === "teacher" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({...formData, role: "teacher"})}
                >
                  Teacher
                </Button>
                <Button 
                  variant={formData.role === "invigilator" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({...formData, role: "invigilator"})}
                >
                  Invigilator
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assign Classes (click to select)</Label>
              {formData.assignedClasses.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {formData.assignedClasses.map((cls) => (
                    <Badge key={cls} variant="default" className="flex items-center gap-1">
                      {cls}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeAssignedClass(cls)} />
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 border rounded-md">
                {availableClasses.map((cls) => (
                  <Badge 
                    key={cls} 
                    variant={formData.assignedClasses.includes(cls) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => toggleClass(cls)}
                  >
                    {cls}
                  </Badge>
                ))}
              </div>
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
    </div>
  );
};

export default UserManagement;