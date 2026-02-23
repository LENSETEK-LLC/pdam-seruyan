import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../services/firebase';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-primary size-12 rounded-xl flex items-center justify-center text-white mb-4 animate-pulse">
                    <span className="material-symbols-outlined text-2xl">water_drop</span>
                </div>
                <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-[shimmer_1.5s_infinite] origin-left"></div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Memuat aplikasi...</p>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: scaleX(0) translateX(0); }
                        50% { transform: scaleX(0.5) translateX(50%); }
                        100% { transform: scaleX(0) translateX(100%); }
                    }
                `}</style>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
