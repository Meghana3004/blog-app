export const validateMobile = (mobile) => {
    const mobilePattern = /^\d{10}$/;
    return mobilePattern.test(mobile);
  };
  
  export const validateForm = (formData) => {
    const { name, email, username, dob, mobile } = formData;
    if (!name || !email || !username || !dob || !mobile) {
      return "Please fill all the required fields";
    }
    if (!validateMobile(mobile)) {
      return "Enter valid mobile number";
    }
    return null;
  };

