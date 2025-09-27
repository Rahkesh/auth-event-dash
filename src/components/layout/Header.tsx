import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { LogOut, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    }
  };

  return (
    <header className="border-b border-border bg-gradient-primary backdrop-blur supports-[backdrop-filter]:bg-gradient-primary/60 shadow-elegant">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Calendar App</h1>
              <p className="text-xs text-white/80">Manage your events beautifully</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-white/90 font-medium">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-white/70">
                Welcome back!
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/10 text-white hover:bg-white/30 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};