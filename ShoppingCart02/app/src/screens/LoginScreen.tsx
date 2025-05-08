import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import UserApi from '../api/UserApi';
import { UserDto } from '../types/DTOs';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (isMountedRef.current) {
                setIsLoading(false);
                // Fix: Use 'Home' instead of 'HomeScreen'
                navigation.replace('Home');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (isMountedRef.current) {
                setIsLoading(false);
                setError('Invalid login credentials. Please try again.');
            }
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            try {
                const userData: UserDto = {
                    id: userCredential.user.uid,
                    email: userCredential.user.email || '',
                    cart: [],
                    favorites: []
                };

                await UserApi.createUser(userData);
            } catch (dbError) {
                console.error('Failed to save user to database:', dbError);
            }

            if (isMountedRef.current) {
                setIsLoading(false);
                // Fix: Use 'Home' instead of 'HomeScreen'
                navigation.replace('Home');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            if (isMountedRef.current) {
                setIsLoading(false);
                if (err.code === 'auth/email-already-in-use') {
                    setError('This email is already in use. Please try logging in.');
                } else if (err.code === 'auth/invalid-email') {
                    setError('The email address is not valid.');
                } else if (err.code === 'auth/weak-password') {
                    setError('The password is too weak. Please use a stronger password.');
                } else {
                    setError('Failed to register. Please try again.');
                }
            }
        }
    };

    const handleSubmit = () => {
        if (isRegisterMode) {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome to backettwear</Text>
                <Text style={styles.subtitle}>
                    {isRegisterMode ? 'Create an account' : 'Sign in to continue'}
                </Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                    placeholder="Enter your email address"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                />

                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                    placeholder="Enter your password"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                />

                {isRegisterMode && (
                    <>
                        <Text style={styles.fieldLabel}>Confirm Password</Text>
                        <TextInput
                            placeholder="Re-enter your password"
                            secureTextEntry
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            editable={!isLoading}
                        />
                    </>
                )}

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>
                            {isRegisterMode ? 'Register' : 'Login'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => {
                        setIsRegisterMode(!isRegisterMode);
                        setError('');
                    }}
                >
                    <Text style={styles.toggleText}>
                        {isRegisterMode
                            ? 'Already have an account? Sign In'
                            : 'Need an account? Sign Up'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
        textAlign: 'center',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
        marginLeft: 2,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    loginButton: {
        backgroundColor: '#000000',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    toggleButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    toggleText: {
        color: '#000000',
        fontSize: 14,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
