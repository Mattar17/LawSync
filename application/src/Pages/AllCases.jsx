import { NavLink } from "react-router-dom";
import Case from "../Components/Case.jsx";

export default function AllCases({ Cases, handleCasesChanged }) {
  return (
    <>
      {Cases?.length === 0 ? (
        <div className="mx-auto flex flex-col items-center justify-center">
          <h1>لا يوجد قضايا</h1>
          <NavLink className="hover:underline" to="/add">
            إبدأ بإضافة قضية جديدة
          </NavLink>
        </div>
      ) : (
        <div className="grid bg-bg grid-cols-4 justify-right gap-6 py-8 px-6">
          {Cases?.map((c) => (
            <Case
              key={c._id}
              caseDetails={c}
              handleCasesChanged={handleCasesChanged}
            />
          ))}
        </div>
      )}
    </>
  );
}
