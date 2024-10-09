import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
              <div className="text-center">
                <h2 className="text-2xl mb-4">
                  Please Sign In to Access the App
                </h2>
                <SignInButton mode="modal">
                  <button className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            {/* Show the user profile button and the rest of the app when signed in */}
            <div className="flex items-center justify-end p-4 bg-gray-900">
              <UserButton />
            </div>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
