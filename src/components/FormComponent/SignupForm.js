import React from 'react';

const SignupForm = ({ onSubmit }) => (
  <form onSubmit={onSubmit}>
    <div className="mb-3">
      <input type="text" className="form-control control" id="name" placeholder="Enter your name" required />
    </div>
    <div className="mb-3">
      <input type="email" className="form-control control" id="email" placeholder="Enter your email" required />
    </div>
    <div className="mb-3">
      <input type="text" className="form-control control" id="username" placeholder="Enter your username" required />
    </div>
    <div className="mb-3">
      <input type="password" className="form-control control" id="password" placeholder="Password (at least 12 characters)" autoComplete="new-password" minLength={12} required />
    </div>
    <div className="mb-3">
      <input type="password" className="form-control control" id="confirmPassword" placeholder="Confirm password" autoComplete="new-password" minLength={12} required />
    </div>
    <div className="mb-3">
      <label htmlFor="dob" className="form-label">Date of Birth:</label>
      <input type="date" className="form-control control" id="dob" required />
    </div>
    <div className="mb-3">
      <input type="text" className="form-control control" id="mobile" placeholder="Enter your Mobile Number" required maxLength="10" />
    </div>
    <button type="submit" className="btn btn-green text-white-75">Sign Up</button>
  </form>
);

export default SignupForm;