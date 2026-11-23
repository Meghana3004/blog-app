import { validateForm } from './authUtils';

const validForm = {
  name: 'A reader',
  email: 'reader@example.com',
  username: 'reader',
  dob: '2000-01-01',
  mobile: '1234567890',
  password: 'a-strong-password',
  confirmPassword: 'a-strong-password',
};

test('accepts a complete signup with matching strong passwords', () => {
  expect(validateForm(validForm)).toBeNull();
});

test('rejects mismatched passwords', () => {
  expect(validateForm({ ...validForm, confirmPassword: 'different-password' }))
    .toBe('Passwords do not match');
});

test('rejects passwords shorter than twelve characters', () => {
  expect(validateForm({ ...validForm, password: 'short', confirmPassword: 'short' }))
    .toBe('Password must be at least 12 characters');
});
