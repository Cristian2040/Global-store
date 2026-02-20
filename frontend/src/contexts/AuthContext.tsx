'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { User, Store, Supplier, Company, AuthResponse } from '@/types';

interface AuthContextType {
    user: User | null;
    relatedData: Store | Supplier | Company | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [relatedData, setRelatedData] = useState<Store | Supplier | Company | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for stored auth data on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRelatedData = localStorage.getItem('relatedData');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            if (storedRelatedData) {
                setRelatedData(JSON.parse(storedRelatedData));
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', {
                email,
                password,
            });

            const { user, token, relatedData } = response.data.data;

            setUser(user);
            setToken(token);
            setRelatedData(relatedData || null);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (relatedData) {
                localStorage.setItem('relatedData', JSON.stringify(relatedData));
            }

            // Redirect based on role
            router.push(`/${user.role}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (data: any) => {
        try {
            const response = await api.post<AuthResponse>('/auth/register', data);

            const { user, token, relatedData } = response.data.data;

            setUser(user);
            setToken(token);
            setRelatedData(relatedData || null);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (relatedData) {
                localStorage.setItem('relatedData', JSON.stringify(relatedData));
            }

            // Redirect based on role
            router.push(`/${user.role}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRelatedData(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('relatedData');
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                relatedData,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
