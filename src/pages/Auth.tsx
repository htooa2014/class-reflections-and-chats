import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName,
            },
          },
        });

        if (error) {
          // Handle specific signup errors
          if (error.message.includes('rate limit')) {
            toast({
              title: "စောင့်ဆိုင်းပါ",
              description: "အကောင့်ဖွင့်ခြင်းကို ခဏစောင့်ပြီး ထပ်ကြိုးစားပါ",
              variant: "destructive",
            });
          } else if (error.message.includes('already registered')) {
            toast({
              title: "အကောင့်ရှိပြီးသားပါ",
              description: "ဤအီးမေးလ်ဖြင့် အကောင့်ရှိပြီးသားပါ။ ဝင်ရောက်ကြည့်ပါ",
              variant: "destructive",
            });
          } else {
            throw error;
          }
          return;
        }

        // Clear form and show success message
        setEmail("");
        setPassword("");
        setDisplayName("");
        toast({
          title: "အကောင့်ဖွင့်ပြီးပါပြီ",
          description: "သင့်အီးမေးလ်ကို စစ်ဆေးပြီး အတည်ပြုလင့်ခ်ကို နှိပ်ပါ။ ထို့နောက် ဝင်ရောက်နိုင်ပါပြီ",
        });
        
        // Switch to login mode after successful signup
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Handle specific login errors  
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "အကောင့်အချက်အလက် မှားယွင်းနေပါတယ်",
              description: "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါတယ်",
              variant: "destructive",
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              title: "အီးမေးလ် အတည်ပြုရန်လိုအပ်ပါတယ်",
              description: "သင့်အီးမေးလ်ကို စစ်ဆေးပြီး အတည်ပြုလင့်ခ်ကို နှိပ်ပါ",
              variant: "destructive",
            });
          } else {
            throw error;
          }
          return;
        }

        toast({
          title: "ဝင်ရောက်ပြီးပါပြီ",
          description: "ကြိုဆိုပါတယ်!",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "အမှားတစ်ခုဖြစ်ပွားနေပါတယ်",
        description: error.message || "ကွန်ယက်ပြဿနာရှိနေပါတယ်။ ထပ်ကြိုးစားပါ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 gradient-hero opacity-90"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-glow">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-glow">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isSignUp ? "အကောင့်ဖွင့်ရန်" : "ဝင်ရောက်ရန်"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "သင်တန်းတွေကို လိုက်ကြည့်ပြီး မှတ်ချက်ပေးဖို့ အကောင့်ဖွင့်ပါ" 
              : "သင့်အကောင့်နဲ့ ဝင်ရောက်ပါ"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium">နာမည်</label>
                <Input
                  type="text"
                  placeholder="သင့်နာမည်ကို ရိုက်ထည့်ပါ"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">အီးမေးလ်</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">စကားဝှက်</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? "စောင့်ပါ..." 
                : isSignUp 
                  ? "အကောင့်ဖွင့်ရန်" 
                  : "ဝင်ရောက်ရန်"
              }
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                အကောင့်ရှိပြီးသားလား?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-primary hover:underline"
                >
                  ဝင်ရောက်ရန်
                </button>
              </>
            ) : (
              <>
                အကောင့်မရှိသေးဘူးလား?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-primary hover:underline"
                >
                  အကောင့်ဖွင့်ရန်
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;