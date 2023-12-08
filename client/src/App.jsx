import { EthProvider } from "./contexts/EthContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Container from "./layout/Container";
import Profile from "./pages/User/Profile";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Deposit from "./pages/User/Deposit";
import Withdraw from "./pages/User/Withdraw";
import Loan from "./pages/User/Loan";

function App() {
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Container />,
      children: [
        {
          path: "/",
          element: <Home />,
          children: [
            {
              path: "/deposit",
              element: <Deposit/>,
            },
            {
              path: "/withdraw",
              element: <Withdraw />
            },
            {
              path: "/loan",
              element: <Loan />
            },
            {
              path: "/profile",
              element: <Profile/>,
            }
          ]
        },
        {
          path: "/admin",
          element: <Admin />,
        },
      ],
    },
  ]);

  return (
    <EthProvider>
      <RouterProvider router={router} />
    </EthProvider>
  );
}

export default App;
