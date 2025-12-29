import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  Video, 
  Activity,
  TrendingUp,
  Clock
} from "lucide-react";

const stats = [
  { 
    title: "Total Classes", 
    value: "24", 
    change: "+3 this month", 
    icon: GraduationCap,
    color: "bg-primary/10 text-primary"
  },
  { 
    title: "Active Streams", 
    value: "12", 
    change: "Currently live", 
    icon: Video,
    color: "bg-success/10 text-success"
  },
  { 
    title: "Assigned Users", 
    value: "18", 
    change: "+2 this week", 
    icon: Users,
    color: "bg-accent/10 text-accent"
  },
  { 
    title: "Detection Rate", 
    value: "98.5%", 
    change: "+0.3% improvement", 
    icon: Activity,
    color: "bg-primary/10 text-primary"
  },
];

const recentActivity = [
  { action: "Class 10-A stream started", time: "2 minutes ago", user: "Mr. Johnson" },
  { action: "New user added", time: "15 minutes ago", user: "System" },
  { action: "Class 8-B session ended", time: "1 hour ago", user: "Ms. Smith" },
  { action: "Model updated to YOLOv8", time: "3 hours ago", user: "Admin" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" subtitle="Overview of your classroom monitoring system" />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-success" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Add New Class</p>
                    <p className="text-sm text-muted-foreground">Create a new classroom</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Assign Teacher</p>
                    <p className="text-sm text-muted-foreground">Add user to stream</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-colors">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">View All Streams</p>
                    <p className="text-sm text-muted-foreground">Monitor live feeds</p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
