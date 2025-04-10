import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Form.module.css';
import { validateUserFormInputs } from '@/lib/userValidator';
import { fetchUserById, updateUser } from '@/lib/api';

export default function UserDetail({ initialUser, userId }) {
  const router = useRouter();

  const [form, setForm] = useState({
    ...initialUser,
    interest: initialUser.interest.join(', '),
  });

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const validationError = validateUserFormInputs(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      ...form,
      age: parseInt(form.age),
      mobile: parseInt(form.mobile),
      interest: form.interest.split(',').map((item) => item.trim()),
    };

    setLoading(true);
    try {
      const updated = await updateUser(userId, payload);
      setForm({
        ...updated,
        interest: updated.interest.join(', '),
      });
      setEdit(false);
      setError('');
    } catch (err) {
      setError(err?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      ...initialUser,
      interest: initialUser.interest.join(', '),
    });
    setEdit(false);
    setError('');
  };

  if (!form) {
    return <p className={styles.error}>User not found</p>;
  }

  return (
    <div className={styles.formContainer} key={userId}>
      {error && <p className={styles.error}>{error}</p>}

      <input name="user" value={form.user} disabled={!edit} onChange={handleChange} />
      <input name="email" value={form.email} disabled={!edit} onChange={handleChange} />
      <input name="age" type="number" value={form.age} disabled={!edit} onChange={handleChange} />
      <input name="mobile" value={form.mobile} disabled={!edit} onChange={handleChange} />
      <input name="interest" value={form.interest} disabled={!edit} onChange={handleChange} />

      {!edit ? (
        <button onClick={() => setEdit(true)} className={styles.editButton}>Edit</button>
      ) : (
        <>
          <button onClick={handleUpdate} className={styles.saveButton}>Save</button>
          <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
        </>
      )}

      {loading && <div className={styles.spinner}></div>}
    </div>
  );
}
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const user = await fetchUserById(id);
    return {
      props: {
        initialUser: user,
        userId: id,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}