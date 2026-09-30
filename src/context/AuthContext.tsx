import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserAddress, UserProfileData } from '../types';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfileData | null;
  addresses: UserAddress[];
  defaultAddress: UserAddress | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  isAccountDrawerOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openAccountDrawer: () => void;
  closeAccountDrawer: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  loginDemo: (email?: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>) => Promise<UserAddress>;
  updateAddress: (id: string, address: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PROFILE = 'kawanlokal_user_profile';
const LOCAL_STORAGE_KEY_ADDRESSES = 'kawanlokal_user_addresses';
const LOCAL_STORAGE_KEY_DEMO_USER = 'kawanlokal_demo_user';
const LOCAL_STORAGE_KEY_LOCAL_ACCOUNTS = 'kawanlokal_local_accounts';

interface LocalAccount {
  id: string;
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  createdAt: string;
}

const getStoredLocalAccounts = (): LocalAccount[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LOCAL_ACCOUNTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalAccount = (acc: LocalAccount) => {
  try {
    const list = getStoredLocalAccounts().filter(
      (u) => u.email.toLowerCase() !== acc.email.toLowerCase()
    );
    list.push(acc);
    localStorage.setItem(LOCAL_STORAGE_KEY_LOCAL_ACCOUNTS, JSON.stringify(list));
  } catch {
    // ignore storage quota error
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [addresses, setAddresses] = useState<UserAddress[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ADDRESSES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

  // Sync state to local storage for quick access
  useEffect(() => {
    if (profile) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PROFILE);
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load Profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfileData;
            setProfile(data);
          } else {
            // First time login with Google or new user: create initial profile doc
            const initialProfile: UserProfileData = {
              userId: user.uid,
              displayName: user.displayName || user.email?.split('@')[0] || 'Sobat Jajan',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
              photoURL: user.photoURL || '',
              favoriteCategory: 'Pedas Gurih',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
        } catch (err) {
          console.warn('Error reading user profile from Firestore:', err);
          // Fallback to local profile
          if (!profile) {
            setProfile({
              userId: user.uid,
              displayName: user.displayName || 'Sobat Jajan',
              email: user.email || '',
              phoneNumber: '',
              photoURL: user.photoURL || '',
            });
          }
        }

        // Listen to Addresses subcollection
        try {
          const addressesRef = collection(db, 'users', user.uid, 'addresses');
          const unsubAddresses = onSnapshot(
            addressesRef,
            (snapshot) => {
              const items: UserAddress[] = [];
              snapshot.forEach((d) => {
                items.push(d.data() as UserAddress);
              });
              if (items.length > 0) {
                setAddresses(items);
              }
            },
            (error) => {
              handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/addresses`);
            }
          );
          return () => unsubAddresses();
        } catch (err) {
          console.warn('Error syncing addresses from Firestore:', err);
        }
      } else {
        // Check if demo user is stored
        const demoUserJson = localStorage.getItem(LOCAL_STORAGE_KEY_DEMO_USER);
        if (demoUserJson) {
          try {
            const demoUser = JSON.parse(demoUserJson);
            setProfile(demoUser);
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
          setAddresses([]);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openAccountDrawer = () => {
    setIsAccountDrawerOpen(true);
  };

  const closeAccountDrawer = () => {
    setIsAccountDrawerOpen(false);
  };

  // 1. Google Popup Login
  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      closeAuthModal();
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  // 2. Email / Password Login
  const loginWithEmail = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (!trimmedEmail) {
      const err = new Error('Alamat email wajib diisi.');
      (err as any).code = 'auth/invalid-email';
      throw err;
    }
    if (!trimmedPass) {
      const err = new Error('Kata sandi wajib diisi.');
      (err as any).code = 'auth/wrong-password';
      throw err;
    }

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
      closeAuthModal();
      return;
    } catch (err: any) {
      console.warn('Firebase signIn attempt note:', err.code);

      // Check if user was registered locally
      const localAccounts = getStoredLocalAccounts();
      const matched = localAccounts.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (matched) {
        if (matched.password === trimmedPass) {
          const userProfile: UserProfileData = {
            userId: matched.id,
            displayName: matched.displayName,
            email: matched.email,
            phoneNumber: matched.phoneNumber,
            favoriteCategory: 'Pedas Gurih',
            createdAt: matched.createdAt,
            updatedAt: new Date().toISOString(),
          };
          setProfile(userProfile);
          localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
          closeAuthModal();
          return;
        } else {
          const wrongPassErr = new Error('Kata sandi yang Anda masukkan salah.');
          (wrongPassErr as any).code = 'auth/wrong-password';
          throw wrongPassErr;
        }
      }

      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/operation-not-allowed'
      ) {
        const notFoundErr = new Error('Akun dengan email ini belum terdaftar. Silakan buat akun baru.');
        (notFoundErr as any).code = 'auth/user-not-found';
        throw notFoundErr;
      }

      throw err;
    }
  };

  // 3. Email Register
  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    phone: string
  ) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedPass = pass.trim();

    if (!trimmedName) {
      const err = new Error('Nama lengkap wajib diisi.');
      (err as any).code = 'auth/missing-name';
      throw err;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      const err = new Error('Format alamat email tidak valid.');
      (err as any).code = 'auth/invalid-email';
      throw err;
    }
    if (trimmedPass.length < 6) {
      const err = new Error('Kata sandi minimal 6 karakter.');
      (err as any).code = 'auth/weak-password';
      throw err;
    }

    // Check if already registered locally
    const localAccounts = getStoredLocalAccounts();
    if (localAccounts.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      const err = new Error('Email ini sudah terdaftar. Silakan klik tab "Masuk".');
      (err as any).code = 'auth/email-already-in-use';
      throw err;
    }

    let userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      const res = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
      await updateFirebaseProfile(res.user, { displayName: trimmedName });
      userId = res.user.uid;

      const newProfile: UserProfileData = {
        userId,
        displayName: trimmedName,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
        favoriteCategory: 'Pedas Gurih',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, newProfile);
      } catch (e) {
        console.warn('Firestore setDoc deferred, keeping profile local:', e);
      }

      // Also keep in local registered list for seamless resilience
      saveLocalAccount({
        id: userId,
        email: trimmedEmail,
        password: trimmedPass,
        displayName: trimmedName,
        phoneNumber: trimmedPhone,
        createdAt: new Date().toISOString(),
      });

      setProfile(newProfile);
      closeAuthModal();
      return;
    } catch (firebaseErr: any) {
      console.warn('Firebase createUser note:', firebaseErr.code);

      // If email is already in use in Firebase, notify user to login
      if (firebaseErr.code === 'auth/email-already-in-use') {
        const err = new Error('Email ini sudah terdaftar. Silakan pilih tab "Masuk".');
        (err as any).code = 'auth/email-already-in-use';
        throw err;
      }

      // If Firebase blocked email/password provider (auth/operation-not-allowed) or offline:
      // create the account seamlessly in local persistent storage!
      const newLocalAcc: LocalAccount = {
        id: userId,
        email: trimmedEmail,
        password: trimmedPass,
        displayName: trimmedName,
        phoneNumber: trimmedPhone,
        createdAt: new Date().toISOString(),
      };
      saveLocalAccount(newLocalAcc);

      const localProfile: UserProfileData = {
        userId,
        displayName: trimmedName,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
        favoriteCategory: 'Pedas Gurih',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProfile(localProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(localProfile));
      closeAuthModal();
    }
  };

  // 4. Fast Demo 1-Click Login (Simulate user for quick preview test)
  const loginDemo = async (
    email: string = 'aditya.jajan@kawanlokal.id',
    name: string = 'Aditya Pratama'
  ) => {
    const demoProfile: UserProfileData = {
      userId: 'demo-user-88',
      displayName: name,
      email,
      phoneNumber: '081298765432',
      favoriteCategory: 'Pedas Ekstra Daun Jeruk',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialDemoAddresses: UserAddress[] = [
      {
        id: 'addr-demo-1',
        userId: 'demo-user-88',
        label: 'Rumah',
        recipientName: name,
        phoneNumber: '081298765432',
        street: 'Jl. Tebet Timur Dalam Raya No. 42, RT 05 / RW 08',
        city: 'Jakarta Selatan',
        postalCode: '12820',
        notes: 'Pagar abu-abu, dekat Pos Satpam Cluster. Tolong taruh di teras bila tidak ada orang.',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'addr-demo-2',
        userId: 'demo-user-88',
        label: 'Kantor',
        recipientName: `${name} (Divisi Kreatif)`,
        phoneNumber: '081298765432',
        street: 'Gedung Menara Rajawali Lt. 14, Kawasan Mega Kuningan',
        city: 'Jakarta Selatan',
        postalCode: '12950',
        notes: 'Titipkan di Receptionist Lobby Lantai Dasar.',
        isDefault: false,
        createdAt: new Date().toISOString(),
      },
    ];

    setProfile(demoProfile);
    setAddresses(initialDemoAddresses);
    localStorage.setItem(LOCAL_STORAGE_KEY_DEMO_USER, JSON.stringify(demoProfile));
    closeAuthModal();
  };

  // 5. Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY_DEMO_USER);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PROFILE);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ADDRESSES);
    setCurrentUser(null);
    setProfile(null);
    setAddresses([]);
    closeAccountDrawer();
  };

  // 6. Update Profile
  const updateUserProfile = async (data: Partial<UserProfileData>) => {
    if (!profile) return;
    const updated: UserProfileData = {
      ...profile,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    setProfile(updated);

    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        await setDoc(userDocRef, updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    }
  };

  // 7. Add Address
  const addAddress = async (
    data: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>
  ): Promise<UserAddress> => {
    const id = `addr-${Date.now()}`;
    const userId = currentUser ? currentUser.uid : profile?.userId || 'guest';
    const isFirst = addresses.length === 0;

    const newAddress: UserAddress = {
      ...data,
      id,
      userId,
      isDefault: data.isDefault || isFirst,
      createdAt: new Date().toISOString(),
    };

    let updatedList = addresses;
    if (newAddress.isDefault) {
      updatedList = addresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedList = [newAddress, ...updatedList];
    setAddresses(updatedList);

    if (currentUser) {
      try {
        const addrRef = doc(db, 'users', currentUser.uid, 'addresses', id);
        await setDoc(addrRef, newAddress);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/addresses/${id}`);
      }
    }

    return newAddress;
  };

  // 8. Update Address
  const updateAddress = async (id: string, data: Partial<UserAddress>) => {
    let updatedList = addresses.map((a) => {
      if (a.id === id) {
        return { ...a, ...data };
      }
      if (data.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    setAddresses(updatedList);

    if (currentUser) {
      try {
        const addrRef = doc(db, 'users', currentUser.uid, 'addresses', id);
        await setDoc(addrRef, data, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/addresses/${id}`);
      }
    }
  };

  // 9. Delete Address
  const deleteAddress = async (id: string) => {
    const filtered = addresses.filter((a) => a.id !== id);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    setAddresses(filtered);

    if (currentUser) {
      try {
        const addrRef = doc(db, 'users', currentUser.uid, 'addresses', id);
        await deleteDoc(addrRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/addresses/${id}`);
      }
    }
  };

  // 10. Set Default Address
  const setDefaultAddress = async (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);

    if (currentUser) {
      for (const a of updated) {
        try {
          const addrRef = doc(db, 'users', currentUser.uid, 'addresses', a.id);
          await setDoc(addrRef, { isDefault: a.isDefault }, { merge: true });
        } catch {
          // ignore batch errors
        }
      }
    }
  };

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        addresses,
        defaultAddress,
        loading,
        isAuthModalOpen,
        authModalMode,
        isAccountDrawerOpen,
        openAuthModal,
        closeAuthModal,
        openAccountDrawer,
        closeAccountDrawer,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginDemo,
        logout,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
