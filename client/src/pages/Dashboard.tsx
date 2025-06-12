import { FC } from 'react';
import { useAuth } from '../context/AuthContext.tsx';

const Dashboard: FC = () => {
    const { state, logout } = useAuth();
    const { user } = state;

    return (
        <div className="min-h-screen bg-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-900">Healthcare Dashboard</h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-800">Welcome, {user?.name}!</h2>
                    <p className="text-gray-600 mt-2">
                        Role: <span className="font-medium text-blue-700">{user?.role}</span>
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-100 p-4 rounded-xl shadow-sm">
                            <p className="text-lg font-semibold text-blue-800">Upcoming Appointments</p>
                            <p className="text-gray-600 mt-1">No upcoming appointments.</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-xl shadow-sm">
                            <p className="text-lg font-semibold text-green-800">Health Reports</p>
                            <p className="text-gray-600 mt-1">Your latest reports will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
