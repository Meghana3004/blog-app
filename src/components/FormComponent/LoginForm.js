import React from 'react';

const LoginForm = ({ onSubmit }) => (
  <form onSubmit={onSubmit}>
    <div className="mb-3">
      <input type="email" className="form-control control" id="logEmail" placeholder="Email..." required />
    </div>
    <button type="submit" className="btn btn-green text-white-75">Login</button>
  </form>
);

export default LoginForm;