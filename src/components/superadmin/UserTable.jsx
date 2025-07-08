import React from 'react'
import { LuUserRoundCog } from "react-icons/lu";

const UserTable = ({
    users,
    currentPage,
    totalPages,
    onPreviousPage,
    onNextPage,
}) => {
    return (
        <>
        <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                <th className="px-4 py-3"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                <tr key={user.id}>
                    <td className="px-4 py-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        {user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    </td>
                    <td className="px-4 py-4">
                    <p className="text-sm text-gray-900">{user.role}</p>
                    <p className="text-sm text-gray-500">{user.department}</p>
                    </td>
                    <td className="px-4 py-4">
                    <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {user.status}
                    </span>
                    </td>
                    <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                        {user.permissions.map((perm) => (
                        <span
                            key={perm}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                        >
                            {perm}
                        </span>
                        ))}
                    </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.lastActive}</td>
                    <td className="px-4 py-4 text-center">
                    <button className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600">
                        <LuUserRoundCog className="w-5 h-5" />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            {users.length === 0 && (
            <div className="p-4 text-center text-gray-500">No users found.</div>
            )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
            <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
            Previous
            </button>
            <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
            </span>
            <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
            Next
            </button>
        </div>
        </>
    );
};

export default UserTable;