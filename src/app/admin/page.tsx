"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import Loader from "@/components/Loader";
import { adminAPI, ideasAPI } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { useAuth } from "@/lib/auth-context";
import { User, Idea } from "@/types";
import { 
  FaUsers, 
  FaLightbulb, 
  FaUserTie, 
  FaUserAstronaut, 
  FaTrash, 
  FaBan, 
  FaCheckCircle, 
  FaTachometerAlt, 
  FaSignOutAlt 
} from "react-icons/fa";
import { Button } from "@heroui/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalIdeas: number;
  totalFounders: number;
  totalInvestors: number;
}

type Tab = 'overview' | 'users' | 'ideas';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Modal states
  const [deleteIdeaId, setDeleteIdeaId] = useState<string | null>(null);
  const [blockUserObj, setBlockUserObj] = useState<{id: string, isBlocked: boolean} | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, usersData, ideasData] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers(),
          ideasAPI.getAll()
        ]);

        if (active) {
          setStats(statsData);
          setUsers(usersData || []);
          setIdeas(ideasData || []);
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : "Failed to load admin data";
          showToast(message, "error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [showToast]);

  const confirmToggleBlock = async () => {
    if (!blockUserObj) return;
    try {
      const res = await adminAPI.toggleBlockUser(blockUserObj.id);
      setUsers((prev) => 
        prev.map((u) => u._id === blockUserObj.id ? { ...u, isBlocked: res.isBlocked } : u)
      );
      showToast(res.message, "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update user status";
      showToast(message, "error");
    } finally {
      setBlockUserObj(null);
    }
  };

  const confirmDeleteIdea = async () => {
    if (!deleteIdeaId) return;
    try {
      await ideasAPI.delete(deleteIdeaId);
      setIdeas((prev) => prev.filter((idea) => idea._id !== deleteIdeaId));
      showToast("Idea deleted successfully", "success");
      
      setStats((prev) => prev ? { ...prev, totalIdeas: Math.max(0, prev.totalIdeas - 1) } : prev);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete idea";
      showToast(message, "error");
    } finally {
      setDeleteIdeaId(null);
    }
  };

  const renderOverview = () => (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 shadow-sm md:px-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Platform overview and metrics.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="rounded-xl bg-blue-50 p-1.5 text-blue-600">
              <FaUsers size={16} />
            </div>
            <h3 className="font-semibold text-sm">Total Users</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
        </div>

        <div className="flex flex-col gap-1 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="rounded-xl bg-amber-50 p-1.5 text-amber-600">
              <FaLightbulb size={16} />
            </div>
            <h3 className="font-semibold text-sm">Total Ideas</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalIdeas || 0}</p>
        </div>

        <div className="flex flex-col gap-1 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="rounded-xl bg-purple-50 p-1.5 text-purple-600">
              <FaUserAstronaut size={16} />
            </div>
            <h3 className="font-semibold text-sm">Founders</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalFounders || 0}</p>
        </div>

        <div className="flex flex-col gap-1 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="rounded-xl bg-emerald-50 p-1.5 text-emerald-600">
              <FaUserTie size={16} />
            </div>
            <h3 className="font-semibold text-sm">Investors</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalInvestors || 0}</p>
        </div>
      </section>

      {/* Chart Section */}
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Platform Metrics Distribution</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Founders', value: stats?.totalFounders || 0, color: '#9333ea' },
                { name: 'Investors', value: stats?.totalInvestors || 0, color: '#059669' },
                { name: 'Ideas', value: stats?.totalIdeas || 0, color: '#d97706' },
                { name: 'Total Users', value: stats?.totalUsers || 0, color: '#2563eb' }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {
                  [
                    { name: 'Founders', value: stats?.totalFounders || 0, color: '#9333ea' },
                    { name: 'Investors', value: stats?.totalInvestors || 0, color: '#059669' },
                    { name: 'Ideas', value: stats?.totalIdeas || 0, color: '#d97706' },
                    { name: 'Total Users', value: stats?.totalUsers || 0, color: '#2563eb' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );

  const renderUsers = () => (
    <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Manage Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => {
              const isSelf = user?._id === u._id || user?.id === u._id;
              
              return (
                <tr key={u._id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-rose-100 text-rose-800' :
                      u.role === 'INVESTOR' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role || 'USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.isBlocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span> Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span title={isSelf ? "You cannot block yourself" : ""}>
                      <Button 
                        size="sm" 
                        isDisabled={isSelf}
                        variant={u.isBlocked ? "primary" : "outline"}
                        onPress={() => setBlockUserObj({ id: u._id, isBlocked: !!u.isBlocked })}
                        className={u.isBlocked ? "" : "bg-red-50 text-red-600 hover:bg-red-100"}
                      >
                        {u.isBlocked ? (
                          <><FaCheckCircle className="mr-1" /> Unblock</>
                        ) : (
                          <><FaBan className="mr-1" /> Block</>
                        )}
                      </Button>
                    </span>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderIdeas = () => (
    <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Manage Ideas</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Author</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ideas.map((idea) => (
              <tr key={idea._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900 max-w-[200px] truncate" title={idea.title}>
                  {idea.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                    {idea.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-900">{idea.userName || 'Unknown'}</span>
                    <span className="text-xs text-slate-500 truncate max-w-[150px]">{idea.userEmail || ''}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Unknown date'}
                </td>
                <td className="px-6 py-4 text-right">
                  <span title="Delete idea">
                    <Button 
                      isIconOnly
                      size="sm" 
                      variant="ghost"
                      onPress={() => setDeleteIdeaId(idea._id)}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <FaTrash />
                    </Button>
                  </span>
                </td>
              </tr>
            ))}
            {ideas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No ideas found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 shadow-sm">
          <Loader message="Loading dashboard data..." />
        </div>
      );
    }
    
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'ideas': return renderIdeas();
      default: return renderOverview();
    }
  };

  const pageContent = (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between">
        <div className="p-6">
          <h2 className="text-xl font-black tracking-tight text-slate-900 mb-8 px-2">
            Admin Panel
          </h2>
          <nav className="flex flex-col gap-2">
            <Button
              variant={activeTab === 'overview' ? "primary" : "ghost"}
              className="w-full justify-start font-medium"
              onPress={() => setActiveTab('overview')}
            >
              <FaTachometerAlt className="mr-2" /> Overview
            </Button>
            <Button
              variant={activeTab === 'users' ? "primary" : "ghost"}
              className="w-full justify-start font-medium"
              onPress={() => setActiveTab('users')}
            >
              <FaUsers className="mr-2" /> Manage Users
            </Button>
            <Button
              variant={activeTab === 'ideas' ? "primary" : "ghost"}
              className="w-full justify-start font-medium"
              onPress={() => setActiveTab('ideas')}
            >
              <FaLightbulb className="mr-2" /> Manage Ideas
            </Button>
          </nav>
        </div>
        
        {/* Admin Info & Logout */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
              <FaUserAstronaut />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 font-medium"
            onPress={() => logout()}
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:pb-8 md:pt-4">
        <div className="mx-auto max-w-7xl relative">
          {renderContent()}
        </div>
      </main>

      {/* Confirmation Modals */}
      {deleteIdeaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-slate-600">
                Are you sure you want to delete this idea? This action cannot be undone and will permanently remove it from the platform.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
              <Button variant="ghost" onPress={() => setDeleteIdeaId(null)}>
                Cancel
              </Button>
              <Button variant="primary" className="bg-red-600 text-white hover:bg-red-700 border-red-600" onPress={confirmDeleteIdea}>
                Delete Idea
              </Button>
            </div>
          </div>
        </div>
      )}

      {blockUserObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {blockUserObj.isBlocked ? 'Confirm Unblock' : 'Confirm Block'}
              </h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-slate-600">
                Are you sure you want to {blockUserObj.isBlocked ? 'unblock' : 'block'} this user? 
                {blockUserObj.isBlocked ? ' They will regain access to the platform.' : ' They will no longer be able to log in or interact with the platform.'}
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
              <Button variant="ghost" onPress={() => setBlockUserObj(null)}>
                Cancel
              </Button>
              <Button variant="primary" className={blockUserObj.isBlocked ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" : "bg-red-600 text-white hover:bg-red-700 border-red-600"} onPress={confirmToggleBlock}>
                {blockUserObj.isBlocked ? 'Unblock User' : 'Block User'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      {pageContent}
    </RoleGuard>
  );
}
