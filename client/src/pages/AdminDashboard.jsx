import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Crown,
  DollarSign,
  FileText,
  Filter,
  Inbox,
  Layers,
  Mail,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import LoadingScreen from "../components/common/LoadingScreen";
import { API_BASE } from "../config/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "users" | "contacts" | "interviews" | "payments"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [payments, setPayments] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch Overview Data
  const fetchOverview = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/overview`,
        { credentials: "include", headers: getAuthHeaders() }
      );
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setOverview(json.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/users?search=${encodeURIComponent(userSearch)}`,
        { credentials: "include", headers: getAuthHeaders() }
      );
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/contacts`,
        { credentials: "include", headers: getAuthHeaders() }
      );
      const json = await res.json();
      if (json.success) setContacts(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch System Interviews
  const fetchInterviews = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/interviews`,
        { credentials: "include", headers: getAuthHeaders() }
      );
      const json = await res.json();
      if (json.success) setInterviews(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch System Payments
  const fetchPayments = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/payments`,
        { credentials: "include", headers: getAuthHeaders() }
      );
      const json = await res.json();
      if (json.success) setPayments(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([
        fetchOverview(),
        fetchUsers(),
        fetchContacts(),
        fetchInterviews(),
        fetchPayments(),
      ]);
      setLoading(false);
    };
    initData();
  }, []);

  // Re-fetch users when the search term changes, but skip the initial render
  // because initData() already fetches users on mount. Without this guard
  // there would be two parallel /api/admin/users requests on first load.
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      return; // skip first run â€” initData already fetched users
    }
    fetchUsers();
  }, [userSearch]);

  // Actions
  const handleUpdatePlan = async (userId, newPlan) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/users/${userId}/plan`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ plan: newPlan }),
        }
      );
      const json = await res.json();
      if (json.success) {
        fetchUsers();
        fetchOverview();
      }
    } catch (err) {
      alert("Failed to update user plan.");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ role: newRole }),
        }
      );
      const json = await res.json();
      if (json.success) {
        fetchUsers();
      }
    } catch (err) {
      alert("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/users/${userId}`,
        { method: "DELETE", credentials: "include", headers: getAuthHeaders() }
      );
      const json = await res.json();
      if (json.success) {
        fetchUsers();
        fetchOverview();
      }
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const handleUpdateContactStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/contacts/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ status }),
        }
      );
      const json = await res.json();
      if (json.success) {
        fetchContacts();
        fetchOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/contacts/${id}`,
        { method: "DELETE", credentials: "include", headers: getAuthHeaders() }
      );
      const json = await res.json();
      if (json.success) {
        fetchContacts();
        fetchOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-24 dark:bg-zinc-950">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
          <p className="font-semibold">Access Denied / Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-24 sm:px-6 lg:px-8">
      {/* Admin Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-500/10 dark:text-red-400">
              SYSTEM CONTROL PANEL
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
            Admin Management Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Monitor users, revenue, subscriptions, contact inquiries, and system activity.
          </p>
        </div>

        <button
          onClick={() => {
            fetchOverview();
            fetchUsers();
            fetchContacts();
            fetchInterviews();
            fetchPayments();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-zinc-700 border border-zinc-200 shadow-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "overview"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          }`}
        >
          <BarChart3 size={16} /> Overview
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "users"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          }`}
        >
          <Users size={16} /> User Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "contacts"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          }`}
        >
          <Inbox size={16} /> Contact Inbox ({overview?.unreadMessages || 0} unread)
        </button>

        <button
          onClick={() => setActiveTab("interviews")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "interviews"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          }`}
        >
          <Activity size={16} /> System Interviews ({interviews.length})
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "payments"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          }`}
        >
          <CreditCard size={16} /> Revenue & Payments (â‚¹{overview?.totalRevenue || 0})
        </button>
      </div>

      {/* â”€â”€ TAB 1: OVERVIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "overview" && overview && (
        <div className="space-y-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Total Registered Users
                </span>
                <Users size={20} className="text-blue-500" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
                {overview.totalUsers}
              </h2>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Total Gross Revenue
                </span>
                <DollarSign size={20} className="text-emerald-500" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                â‚¹{overview.totalRevenue}
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                {overview.totalTransactions} Success Transactions
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Total Interview Sessions
                </span>
                <Activity size={20} className="text-amber-500" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
                {overview.totalInterviews}
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                {overview.completedInterviews} Completed
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Unread Support Messages
                </span>
                <Inbox size={20} className="text-rose-500" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
                {overview.unreadMessages}
              </h2>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">
              Subscription Plan Distribution
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <span className="text-xs font-bold text-zinc-500">FREE PLAN</span>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {overview.planBreakdown?.FREE || 0} users
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">GOLD PLAN</span>
                <p className="mt-2 text-2xl font-bold text-amber-800 dark:text-amber-300">
                  {overview.planBreakdown?.GOLD || 0} subscribers
                </p>
              </div>
              <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/40 dark:bg-purple-950/20">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-400">PLATINUM PLAN</span>
                <p className="mt-2 text-2xl font-bold text-purple-800 dark:text-purple-300">
                  {overview.planBreakdown?.PLATINUM || 0} subscribers
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ TAB 2: USER MANAGEMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Search size={16} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-transparent text-xs outline-none dark:text-white"
            />
          </div>

          <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Current Plan</th>
                  <th className="p-4">Interviews Used</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                    <td className="p-4">
                      <p className="font-bold text-zinc-900 dark:text-white">{u.name}</p>
                      <p className="text-[11px] text-zinc-400">{u.email}</p>
                    </td>

                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className={`rounded-lg border px-2 py-1 text-xs font-bold outline-none ${
                          u.role === "ADMIN"
                            ? "border-red-300 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                            : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <select
                        value={u.plan}
                        onChange={(e) => handleUpdatePlan(u.id, e.target.value)}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-bold text-zinc-800 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      >
                        <option value="FREE">FREE</option>
                        <option value="GOLD">GOLD</option>
                        <option value="PLATINUM">PLATINUM</option>
                      </select>
                    </td>

                    <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      {u.interviewsUsed} sessions
                    </td>

                    <td className="p-4 text-zinc-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* â”€â”€ TAB 3: CONTACT INBOX â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {contacts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center text-xs text-zinc-400 dark:border-zinc-800">
                No contact inquiry messages yet.
              </div>
            ) : (
              contacts.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl border p-5 transition ${
                    msg.status === "UNREAD"
                      ? "border-blue-300 bg-blue-50/30 dark:border-blue-900/40 dark:bg-blue-950/20"
                      : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {msg.name}
                        </span>
                        <span className="text-xs text-zinc-400">({msg.email})</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            msg.status === "UNREAD"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <h4 className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Subject: {msg.subject}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={msg.status}
                        onChange={(e) =>
                          handleUpdateContactStatus(msg.id, e.target.value)
                        }
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      >
                        <option value="UNREAD">UNREAD</option>
                        <option value="READ">READ</option>
                        <option value="REPLIED">REPLIED</option>
                      </select>

                      <button
                        onClick={() => handleDeleteContact(msg.id)}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300">
                    {msg.message}
                  </p>
                  <p className="mt-2 text-[10px] text-zinc-400">
                    Received: {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* â”€â”€ TAB 4: SYSTEM INTERVIEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "interviews" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                <tr>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Job Role / Description</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {interviews.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                    <td className="p-4 font-medium text-zinc-900 dark:text-white">
                      {item.user?.name || "Unknown"}
                      <p className="text-[10px] text-zinc-400">{item.user?.email}</p>
                    </td>

                    <td className="p-4 max-w-xs truncate text-zinc-700 dark:text-zinc-300">
                      {item.jobDescription}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {item.difficulty}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-0.5 font-bold ${
                          item.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                      {item.report?.score ? `${item.report.score} / 10` : "â€”"}
                    </td>

                    <td className="p-4 text-zinc-400">
                      {new Date(item.startedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* â”€â”€ TAB 5: PAYMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Plan Purchased</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                    <td className="p-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                      {p.paymentId}
                    </td>

                    <td className="p-4 font-medium text-zinc-900 dark:text-white">
                      {p.user?.name}
                      <p className="text-[10px] text-zinc-400">{p.user?.email}</p>
                    </td>

                    <td className="p-4 font-bold text-amber-600 dark:text-amber-400">
                      {p.user?.plan || "GOLD"}
                    </td>

                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      â‚¹{p.amount}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {p.status}
                      </span>
                    </td>

                    <td className="p-4 text-zinc-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminDashboard;

