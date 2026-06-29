import { useEffect, useMemo, useState } from 'react';
import { getAllusers } from '../../firebase';
import Loader from '../../components/Loader/Loader';
import UserCard from '../../components/UserCard/UserCard';
import './ListUsers.scss';
import ScrollToTop from '../../pages/ScrollToTop';
import AppHelmet from '../../pages/AppHelmet';
import { IoSearch, IoClose } from 'react-icons/io5';

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
  { value: 'email-asc', label: 'Email (A–Z)' },
  { value: 'email-desc', label: 'Email (Z–A)' },
  { value: 'sub-desc', label: 'Newest subscription' },
  { value: 'sub-asc', label: 'Oldest subscription' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All users' },
  { value: 'premium', label: 'Premium' },
  { value: 'free', label: 'Free' },
];

export default function ListUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllusers(setUsers, setLoading);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = users.filter((u) => {
      const matchesSearch =
        !q ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q));
      const matchesFilter =
        filter === 'all' ||
        (filter === 'premium' && u.isPremium) ||
        (filter === 'free' && !u.isPremium);
      return matchesSearch && matchesFilter;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return (a.username || '').localeCompare(b.username || '');
        case 'name-desc':
          return (b.username || '').localeCompare(a.username || '');
        case 'email-asc':
          return (a.email || '').localeCompare(b.email || '');
        case 'email-desc':
          return (b.email || '').localeCompare(a.email || '');
        case 'sub-desc':
          return new Date(b.subDate || 0) - new Date(a.subDate || 0);
        case 'sub-asc':
          return new Date(a.subDate || 0) - new Date(b.subDate || 0);
        default:
          return 0;
      }
    });

    return list;
  }, [users, search, sort, filter]);

  const premiumCount = users.filter((u) => u.isPremium).length;
  const freeCount = users.length - premiumCount;

  return (
    <div className="list-users">
      <ScrollToTop />
      <AppHelmet title={'All Users'} />
      {loading && <Loader />}

      {!loading && (
        <>
          <div className="users-toolbar">
            <div className="toolbar-head">
              <h1>All Users</h1>
              <div className="stats">
                <span className="stat-chip">
                  <strong>{users.length}</strong> Total
                </span>
                <span className="stat-chip premium">
                  <strong>{premiumCount}</strong> Premium
                </span>
                <span className="stat-chip free">
                  <strong>{freeCount}</strong> Free
                </span>
              </div>
            </div>

            <div className="controls">
              <div className="search-box">
                <IoSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button type="button" className="clear" onClick={() => setSearch('')} aria-label="Clear search">
                    <IoClose />
                  </button>
                )}
              </div>

              <div className="select-group">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter users">
                  {FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort users">
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="users-grid">
            {filtered.length > 0 ? (
              filtered.map((user) => <UserCard key={user.email} user={user} />)
            ) : (
              <div className="empty-state">
                <p>No users match your search.</p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setSearch('');
                    setFilter('all');
                    setSort('name-asc');
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
