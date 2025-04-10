export const validateUserFormInputs = (form) => {
    if (!form.user || !form.email || !form.age || !form.mobile || !form.interest) {
      return 'All fields are required';
    }
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(form.email)) {
      return 'Invalid email format';
    }
    if (isNaN(form.age) || form.age < 0) {
      return 'Age must be a valid number';
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      return 'Mobile must be a 10-digit number';
    }
    return '';
  };