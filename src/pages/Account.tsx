import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Package, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    // TODO: Implement update profile logic
    setIsEditing(false);
  };

  // Function to handle back navigation
  const handleBack = () => {
    // If there's a previous page in the history, go back
    // Otherwise, navigate to the home page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto py-4 md:py-12 px-4">
      {/* Mobile Back Button */}
      <div className="md:hidden flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="text-foreground hover:bg-accent/10"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold ml-2">My Account</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-0">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="h-full w-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="h-12 w-12 text-accent" />
                )}
              </div>
              <h2 className="text-xl font-semibold">{user?.displayName || 'User'}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Profile Information</CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveChanges}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{user?.displayName || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled // Email changes typically require reauthentication
                      />
                    ) : (
                      <p>{user?.email || 'No email'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                    <p>No orders yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/shop')}>
                      Start Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your password to secure your account.
                    </p>
                    <Button variant="outline" className="mt-2">
                      Change Password
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
