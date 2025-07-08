import { useAuth } from "@/contexts/auth-context";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";

export function TapestryProxy() {
  const { isSignedIn, handleSignIn, currentAccountId } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!currentAccountId) throw new Error("Not logged in");

      const response = await apiClient.makeRequest<any>(
        "POST",
        "/profiles/findOrCreate",
        {
          username: currentAccountId,
          id: '', // can be blank
          bio: 'User bio here',
          execution: 'FAST_UNCONFIRMED',
          customProperties: [
            {
              key: 'profileImage',
              value: 'https://example.com/image.jpg'
            },
            {
              key: 'location',
              value: 'San Francisco, CA'
            }
          ]
        }
      );
      return response;
    },
    onSuccess: (data) => {
      console.log('Profile created:', data);
      toast.success("Profile created successfully!");
    },
    onError: (error) => {
      console.error('Error creating profile:', error);
      toast.error(`Failed to create profile: ${error.message}`);
    },
  });

  const handleClick = () => {
    if (isSignedIn) {
      mutate();
    } else {
      handleSignIn();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tapestry Profile</CardTitle>
        <CardDescription>
          Create or find your Tapestry profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSignedIn ? (
          <p>Logged in as: {currentAccountId}</p>
        ) : (
          <p>Please log in to create a profile.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick} disabled={isPending}>
          {isPending
            ? "Creating Profile..."
            : isSignedIn
            ? "Find or Create Profile"
            : "Login with NEAR"}
        </Button>
      </CardFooter>
    </Card>
  );
}
