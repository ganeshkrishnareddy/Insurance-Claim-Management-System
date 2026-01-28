import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const role = session.user.email?.includes('admin') ? 'admin' : 'user';
                setUser({ ...session.user, role });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const role = session.user.email?.includes('admin') ? 'admin' : 'user';
                setUser({ ...session.user, role });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (username, password) => {
        try {
            // Map simple usernames to emails for Supabase
            let email = username;
            if (!username.includes('@')) {
                email = `${username}@insurance.com`;
            }

            // Map simple passwords for Quick Login demo
            let authPassword = password;
            if (password === 'admin' || password === 'user') {
                authPassword = 'password123';
            }

            // 1. Try to Sign In
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: authPassword,
            });

            if (error) {
                // 2. If user not found (and it's a demo user), try to Sign Up
                if (error.message.includes('Invalid login credentials') && (username === 'admin' || username === 'user')) {
                    console.log("Login failed, trying auto-signup for demo user...");
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: email,
                        password: authPassword,
                    });

                    if (signUpError) {
                        throw signUpError;
                    }

                    if (signUpData.session) {
                        return { success: true };
                    } else if (signUpData.user && !signUpData.session) {
                        // Some Supabase instances require email confirmation by default.
                        // We can't easily auto-confirm, so this might block.
                        // But for 'admin/user' demo, we hope it just works or we warn.
                        return { success: false, message: "Account created! Please check your email to confirm." };
                    }
                }
                throw error;
            }

            return { success: true };

        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: error.message || "Login failed" };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
