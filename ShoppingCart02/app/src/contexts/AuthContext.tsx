import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import UserApi from '../api/UserApi';
import { UserDto , CreateUserDto } from '../types/DTOs';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: false,
    login: () => {},
    logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // Track if the component is mounted
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (isMounted) {
                if (authUser) {
                    // Ensure the user exists in our database when signing in
                    try {
                        const userData: CreateUserDto = {
                            id: authUser.uid,
                            email: authUser.email || ''
                        };

                        console.log('Syncing user with database:', userData);
                        // Check if user exists first
                        const existingUser = await UserApi.getUserById(authUser.uid);

                        if (!existingUser) {
                            // User doesn't exist, create them
                            await UserApi.createUser(userData);
                            console.log('User created in database');
                        } else {
                            console.log('User already exists in database');
                        }
                    } catch (dbError) {
                        console.error('Failed to sync user with database:', dbError);
                        // Continue with the flow even if DB sync fails
                    }

                    setUser(authUser);
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false; // Cleanup on unmount
            unsubscribe(); // Ensure listener is unsubscribed
        };
    }, []);

    const login = (user: User) => {
        setUser(user);
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Add a named export for useAuth hook
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Add default export
export default AuthProvider;

