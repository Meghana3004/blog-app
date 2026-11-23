export const validateMobile = (mobile) => {
    const mobilePattern = /^\d{10}$/;
    return mobilePattern.test(mobile);
  };
  
  export const validateForm = (formData) => {
    const { name, email, username, dob, mobile, password, confirmPassword } = formData;
    if (![name, email, username, dob, mobile, password, confirmPassword].every(
      (value) => typeof value === 'string' && value.trim(),
    )) {
      return 'Please fill all the required fields';
    }
    if (!validateMobile(mobile)) {
      return 'Enter a valid mobile number';
    }
    if (password.length < 12) {
      return 'Password must be at least 12 characters';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

