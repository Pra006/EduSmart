import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, CheckCircle, XCircle, FileText, Calendar, Loader2 } from 'lucide-react';

export default function EducatorApproval() {
  const [educators, setEducators] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const axiosConfig = {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache' // Prevents 304 caching
    },
  };

  const fetchEducators = async () => {
    try {
      setLoading(true);
      // Added a cache-buster query (?t=...) to force fresh data from DB
      const res = await axios.get(`http://localhost:3000/api/admin/pending-educators?t=${Date.now()}`, axiosConfig);

      if (res.data && res.data.data) {
        const mapped = res.data.data.map((e) => ({
          id: e._id,
          fullName: e.fullname || "Unknown Name",
          signupDate: e.createdAt,
          // Replace backslashes with forward slashes for the browser URL
          resumeUrl: e.document ? `http://localhost:3000/${e.document.replace(/\\/g, '/')}` : '#', 
          status: e.approvalStatus || 'pending',
        }));
        setEducators(mapped);
      }
    } catch (err) {
      console.error('Error fetching educators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducators();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.patch(`http://localhost:3000/api/admin/approve-user/${id}`, 
        { status: newStatus }, 
        axiosConfig
      );

      if (res.data.success) {
        setEducators((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        alert(`Educator ${newStatus} successfully`);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filtered = educators.filter((e) => {
    const matchesSearch = e.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Fetching pending requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Educator Approval Dashboard</h2>
          <p className="text-sm text-gray-500">Manage verification requests for new educators</p>
        </div>
        <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
          {educators.filter(e => e.status === 'pending').length} Pending
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-xl shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border-none focus:ring-0 px-3 py-2 outline-none text-gray-700"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 border-l md:border-l-gray-200 px-3 py-2 outline-none bg-transparent cursor-pointer font-medium text-gray-600"
        >
          <option value="all">All Records</option>
          <option value="pending">🟡 Pending</option>
          <option value="approved">🟢 Approved</option>
          <option value="rejected">🔴 Rejected</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16 bg-gray-50 rounded-2xl border-2 border-dashed">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg">No educators match your current filters.</p>
          </div>
        ) : (
          filtered.map((educator) => (
            <div key={educator.id} className="p-5 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-xl text-gray-900 capitalize">{educator.fullName}</h3>
                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Applied: {new Date(educator.signupDate).toLocaleDateString()}</span>
                  </div>

                  <a
                    href={educator.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold decoration-2 underline-offset-4 hover:underline"
                  >
                    <FileText className="w-4 h-4" /> View Credentials
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {educator.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => updateStatus(educator.id, 'approved')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-100"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(educator.id, 'rejected')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-600 border-2 border-red-50 rounded-xl font-bold hover:bg-red-50 active:scale-95 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                ) : (
                  <div className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black uppercase text-xs tracking-wider border ${
                    educator.status === 'approved' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {educator.status === 'approved' ? <CheckCircle className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                    {educator.status}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}