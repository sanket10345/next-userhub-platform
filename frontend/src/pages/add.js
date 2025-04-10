import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Form.module.css';
import { validateUserFormInputs } from '@/lib/userValidator';
import { createUser } from '@/lib/api';

export default function AddUser() {
  const router = useRouter();
  const [form, setForm] = useState({ user: '', email: '', age: '', mobile: '', interest: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationError = validateUserFormInputs(form);
    if (validationError) {
      setError(validationError);
      return;
    }
  
    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        mobile: parseInt(form.mobile),
        interest: form.interest.split(',').map((item) => item.trim()),
      };
  
      await createUser(payload);
      router.push('/');
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err?.message || 'Something went wrong while submitting the form.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {error && <p className={styles.error}>{error}</p>}
      <input name="user" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="age" placeholder="Age" type="number" onChange={handleChange} required />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} required />
      <input name="interest" placeholder="Interests (comma separated)" onChange={handleChange} required />
      <button type="submit" className={styles.submitButton}>Add User</button>
    </form>
  );
}