import { useEffect, useState } from 'react';
import { getAllusers } from '../../firebase';
import Loader from '../../components/Loader/Loader';
import UserCard from '../../components/UserCard/UserCard';
import './ListUsers.scss';
import ScrollToTop from '../../pages/ScrollToTop';
import AppHelmet from '../../pages/AppHelmet';

export default function ListUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Call getAllusers only once when the component mounts
    getAllusers(setUsers, setLoading);
  }, []);

  // Removed the second useEffect to manage the loading state, as it's not needed

  return (
    <div className='list-users'>
      <ScrollToTop />
      <AppHelmet title={"All Users"} />
      {loading && <Loader />}
      {users.length > 0 && users.map(user => (
        <UserCard key={user.email} user={user} />
      ))}
    </div>
  );
}
