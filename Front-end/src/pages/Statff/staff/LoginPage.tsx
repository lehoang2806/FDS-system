const StaffLoginPage = () => {
    return (
        <div className="flex h-screen">
            {/* Left side - Form */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white p-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Let’s get you signed in
                </h2>
                <form className="w-full max-w-sm">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <button className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition">
                        Sign In
                    </button>
                </form>
            </div>

            {/* Right side - Description */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100 p-10">
                <h3 className="text-lg font-semibold text-gray-800">FDS System</h3>
                <p className="text-gray-600 text-center mt-2 max-w-md">
                    Donec justo tortor, malesuada vitae faucibus ac, tristique sit amet
                    massa. Aliquam dignissim nec felis quis imperdiet.
                </p>
            </div>
        </div>
    );
};

export default StaffLoginPage;