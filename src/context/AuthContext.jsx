// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const DEMO_USER_KEY = 'nursury_demo_auth_user';
const DEMO_ROLE_KEY = 'nursury_demo_role';

export function AuthProvider({ children }) {
  const { addToast } = useToast();
  const configured = isSupabaseConfigured();

  const [user, setUser] = useState(() => {
    if (!isSupabaseConfigured()) {
      try {
        const saved = localStorage.getItem(DEMO_USER_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [profile, setProfile] = useState(() => {
    if (!isSupabaseConfigured()) {
      try {
        const saved = localStorage.getItem(DEMO_USER_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [role, setRole] = useState(() => {
    if (!isSupabaseConfigured()) {
      return localStorage.getItem(DEMO_ROLE_KEY) || 'customer';
    }
    return null;
  });

  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  // Helper to load role and profile from Supabase
  const loadUserData = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null);
      setProfile(null);
      setRole(null);
      return;
    }

    setUser(authUser);

    if (isSupabaseConfigured() && supabase) {
      try {
        // 1. Fetch Profile
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileErr) {
          console.warn('[Auth] Error fetching profile:', profileErr.message);
        }

        if (profileData) {
          setProfile(profileData);
        } else {
          // Fallback to auth metadata
          setProfile({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Customer',
            created_at: authUser.created_at
          });
        }

        // 2. Fetch Role strictly from user_roles
        const { data: roleData, error: roleErr } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (roleErr) {
          console.warn('[Auth] Error fetching user role:', roleErr.message);
        }

        const resolvedRole = roleData?.role || 'customer';
        setRole(resolvedRole);
      } catch (err) {
        console.warn('[Auth] Exception loading user data:', err);
        setRole('customer');
      }
    }
  }, []);

  // Initialize Auth state
  useEffect(() => {
    let mounted = true;

    if (isSupabaseConfigured() && supabase) {
      // 1. Initial Session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (mounted) {
          if (error) {
            console.warn('[Auth] getSession error:', error.message);
          }
          if (session?.user) {
            loadUserData(session.user).finally(() => {
              if (mounted) setLoading(false);
            });
          } else {
            setLoading(false);
          }
        }
      });

      // 2. Auth State Change Listener
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          await loadUserData(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }
  }, [loadUserData]);

  /**
   * Customer Registration
   */
  const signUp = async ({ email, password, fullName }) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Check if email confirmation is required
        if (data.session) {
          await loadUserData(data.user);
          addToast('Account created successfully! Welcome to Nursury 🌿', 'success');
        } else {
          addToast('Account created! Please check your email inbox to confirm your account.', 'info');
        }
        return { success: true, user: data.user, session: data.session };
      }
      return { success: true };
    }

    // Demo Mode Sign Up
    const demoId = `user-${Date.now()}`;
    const demoUser = {
      id: demoId,
      email,
      full_name: fullName,
      displayName: fullName,
      bio: 'Botanical enthusiast & plant lover.',
      created_at: new Date().toISOString()
    };
    setUser(demoUser);
    setProfile(demoUser);
    setRole('customer');
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem(DEMO_ROLE_KEY, 'customer');
    addToast('Account created (Demo Mode)! Welcome to Nursury 🌿', 'success');
    return { success: true, user: demoUser };
  };

  /**
   * Customer Login
   */
  const signIn = async ({ email, password }) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      await loadUserData(data.user);
      addToast(`Welcome back, ${data.user.user_metadata?.full_name || 'Plant Parent'}!`, 'success');
      return { success: true, user: data.user };
    }

    // Demo Mode Sign In
    const demoUser = {
      id: 'demo-cust-01',
      email,
      full_name: 'Aarav Sharma',
      displayName: 'Aarav Sharma',
      bio: 'Indoor jungle curator in Bengaluru.',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    };
    setUser(demoUser);
    setProfile(demoUser);
    setRole('customer');
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem(DEMO_ROLE_KEY, 'customer');
    addToast('Logged in as Aarav Sharma (Demo Mode)', 'success');
    return { success: true, user: demoUser };
  };

  /**
   * Administrator Login (Strict role verification)
   */
  const signInAdmin = async ({ email, password }) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      // Verify admin role in database
      const { data: roleRow, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError || !roleRow) {
        // Immediate logout of non-admin user trying to access admin login
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        const msg = 'Access denied. This account does not possess Administrator privileges.';
        addToast(msg, 'error');
        return { success: false, error: msg };
      }

      await loadUserData(data.user);
      addToast('Welcome to Nursury Admin Command 🌿', 'success');
      return { success: true, user: data.user };
    }

    // Demo Mode Admin Sign In
    const demoAdmin = {
      id: 'demo-admin-01',
      email,
      full_name: 'Store Administrator',
      displayName: 'Store Administrator',
      bio: 'Head of Nursury Botanical Operations',
      created_at: new Date().toISOString()
    };
    setUser(demoAdmin);
    setProfile(demoAdmin);
    setRole('admin');
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoAdmin));
    localStorage.setItem(DEMO_ROLE_KEY, 'admin');
    addToast('Logged in as Store Administrator (Demo Mode)', 'success');
    return { success: true, user: demoAdmin };
  };

  /**
   * Logout
   */
  const signOut = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setRole(null);
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.removeItem(DEMO_ROLE_KEY);
    addToast('You have been logged out securely.', 'info');
  };

  /**
   * Forgot Password (send password reset email)
   */
  const resetPassword = async (email) => {
    if (isSupabaseConfigured() && supabase) {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }
      addToast('Password reset instructions sent to your email!', 'success');
      return { success: true };
    }

    addToast('Demo: Reset link simulated. You may set a new password.', 'info');
    return { success: true };
  };

  /**
   * Update Password
   */
  const updatePassword = async (newPassword) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }
      addToast('Your password has been updated successfully!', 'success');
      return { success: true };
    }

    addToast('Password updated successfully (Demo Mode)!', 'success');
    return { success: true };
  };

  /**
   * Update Profile (Customers can only edit display information, NOT roles)
   */
  const updateProfile = async (updates) => {
    // Sanitized: remove any attempt to alter role or id
    const sanitized = {
      full_name: updates.full_name || updates.displayName,
      phone: updates.phone,
      bio: updates.bio,
      avatar_url: updates.avatar_url
    };

    if (isSupabaseConfigured() && supabase && user) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...sanitized,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      setProfile(data);
      addToast('Profile updated successfully!', 'success');
      return { success: true, data };
    }

    // Demo Mode Profile update
    const nextProfile = {
      ...profile,
      ...updates,
      displayName: updates.full_name || updates.displayName || profile?.displayName
    };
    setProfile(nextProfile);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(nextProfile));
    addToast('Profile updated successfully!', 'success');
    return { success: true, data: nextProfile };
  };

  /**
   * Switch Demo Role (convenient for local UI evaluation before connecting live Supabase)
   */
  const switchDemoRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem(DEMO_ROLE_KEY, newRole);
    if (!user) {
      const demoUser = {
        id: `demo-${newRole}-01`,
        email: newRole === 'admin' ? 'admin@nursury.store' : 'customer@nursury.store',
        full_name: newRole === 'admin' ? 'Store Administrator' : 'Aarav Sharma',
        displayName: newRole === 'admin' ? 'Store Administrator' : 'Aarav Sharma'
      };
      setUser(demoUser);
      setProfile(demoUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    }
    addToast(`Switched to ${newRole.toUpperCase()} mode (Demo)`, 'info');
  };

  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        loading,
        configured,
        signUp,
        signIn,
        signInAdmin,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
