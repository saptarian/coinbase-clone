import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
})

export const isValidEmail = (email: string): boolean => {
  // Implement email validation logic (e.g., using regex)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

