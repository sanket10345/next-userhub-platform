import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { fetchUsers } from '@/lib/api';
import styles from '../styles/Home.module.css';

// Lazy load the UserTable component
const UserTable = dynamic(() => import('@/components/UserTable'), {
  loading: () => <p className={styles.infoText}>Loading user table...</p>,
  ssr: false, // Load on client-side only
});

export default function Home({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [error, setError] = useState('');
  
  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <h1>User List</h1>
        <Link href="/add" className={styles.addButton}>Add User</Link>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
      {!error && users.length === 0 && (
        <p className={styles.infoText}>No users found. Please add one.</p>
      )}
      {!error && users.length > 0 && (
        <UserTable users={users} />
      )}
    </div>
  );
}

// Fetch users on the server side
export async function getServerSideProps() {
  try {
    const users = await fetchUsers();
    return { props: { initialUsers: users } };
  } catch (error) {
    return { props: { initialUsers: [], error: 'Failed to load users' } };
  }
}
