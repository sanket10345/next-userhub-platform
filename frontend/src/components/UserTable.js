import Link from 'next/link';
import styles from '@/styles/UserTable.module.css';

function UserRow({ user }) {
  return (
    <tr>
      <td>{user.user}</td>
      <td>{user.email}</td>
      <td>{user.age}</td>
      <td>{user.mobile}</td>
      <td>
        <Link href={`/user/${user._id}`} className={styles.viewLink}>
          View
        </Link>
      </td>
    </tr>
  );
}

export default function UserTable({ users }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Mobile</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user._id} user={user} />
        ))}
      </tbody>
    </table>
  );
}