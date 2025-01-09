// // src/Components/ProtectedRoute.jsx
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Navigate } from "react-router-dom";

// export const ProtectedRoute = ({ children, allowedRoles }) => {
//   const dispatch = useDispatch();
//   const { user, isLoading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     // Check authentication status when component mounts
//     if (!user) {
//       dispatch(getMe());
//     }
//   }, [dispatch, user]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/" replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/dasbor" replace />;
//   }

//   return children;
// };
