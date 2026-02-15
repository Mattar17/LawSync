import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AllCases from "./Pages/AllCases.jsx";
import CaseDetails from "./Components/CaseDetails.jsx";
import NewCase from "./Pages/NewCase.jsx";
import UpdateCase from "./Pages/UpdateCase.jsx";
import Login from "./Pages/Login.jsx";
import MainLayout from "./Components/MainLayout.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";
import SetupPasswords from "./Pages/SetupPasswords.jsx";
import Activation from "./Pages/Activation.jsx";

const api_url = import.meta.env.VITE_API_URL;

function App() {
  const [Cases, setCases] = useState(null);
  const [casesChanged, setCasesChanged] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCasesChanged = () => {
    setCasesChanged((prev) => !prev);
  };

  useEffect(() => {
    console.log(api_url);
    fetch(
      searchQuery !== "" ? `${api_url}/search?q=${searchQuery}` : `${api_url}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        if (data.status === "success") {
          setCases(data.data);
        }
      });
  }, [casesChanged, searchQuery]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/setup-passwords" element={<SetupPasswords />}></Route>
        <Route path="/forget_password" element={<ChangePassword />}></Route>
        <Route path="/activation" element={<Activation />} />
        <Route
          element={
            <MainLayout
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
            />
          }
        >
          <Route
            path="/cases"
            element={
              <AllCases Cases={Cases} handleCasesChanged={handleCasesChanged} />
            }
          />
          <Route
            path="/add"
            element={<NewCase handleCasesChanged={handleCasesChanged} />}
          />
          <Route path="/case/:case_id" element={<CaseDetails />} />
          <Route
            path="case/update/:case_id"
            element={<UpdateCase handleCasesChanged={handleCasesChanged} />}
          />
          <Route path="/change_password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
