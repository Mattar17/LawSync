import { NavLink } from "react-router-dom";
import Case from "../Components/Case.jsx";

export default function AllCases({ Cases, handleCasesChanged }) {
  return (
    <>
      {Cases?.length === 0 ? (
        <div className="mx-auto flex flex-col items-center justify-center mt-4">
          <h1 className="text-xl text-blue-300">لا يوجد قضايا</h1>
          <NavLink className="hover:underline text-2xl text-blue-300" to="/add">
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
