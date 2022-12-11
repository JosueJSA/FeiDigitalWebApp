import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import { AcademicDetails } from "./pages/academics/academic-details.page";
import { AcademicEdition } from "./pages/academics/academic-edition.page";
import { AcademicShortDetails } from "./pages/academics/academic-short-details.page";
import { AcademicSignUp } from "./pages/academics/academic-sign-up.page";
import { Academics } from "./pages/academics/academics.page";
import { SignIn } from "./pages/login/sign-in.page";
import { AcademicSchedule } from "./pages/scheduling/academics-sessions/academic-schedule.page";
import { Courses } from "./pages/scheduling/academics-sessions/courses.page";
import { ClassSessionEdition } from "./pages/scheduling/academics-sessions/session-edition.page";
import { ClassSessionRegistrer } from "./pages/scheduling/academics-sessions/session-registration.page";
import { Sessions } from "./pages/scheduling/academics-sessions/sessions.page";
import { CoursesFollowing } from "./pages/scheduling/students-sessions/courses-following.page";
import { CoursesSearching } from "./pages/scheduling/students-sessions/courses-searching.page";
import { StudentSchedule } from "./pages/scheduling/students-sessions/student-schedule.page";
import { StudentDetails } from "./pages/students/student-details.page";
import { StudentEdition } from "./pages/students/student-edition.page";
import { StudentSignUp } from "./pages/students/student-sign-up.page";
import { Students } from "./pages/students/students.page";
import { Navbar } from "./shared";
import { BreadcrumbsNav } from "./shared/breadcrumns/breadcrumbs.component";
import { Home } from "./shared/home/home.page";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BreadcrumbsNav />
      <Routes>
        <Route path="/login/" element={<SignIn />} />
        <Route path="/home/" element={<Home />} />
        <Route path="/students/" element={<Students />} />
        <Route path="/students/schedule/" element={<StudentSchedule />} />
        <Route path="/students/courses/" element={<CoursesSearching />} />
        <Route
          path="/students/courses/following/"
          element={<CoursesFollowing />}
        />
        <Route path="/academics/" element={<Academics />} />
        <Route path="/academics/schedule/" element={<AcademicSchedule />} />
        <Route path="/academics/courses/" element={<Courses />} />
        <Route path="/academics/courses/sessions/:nrc" element={<Sessions />} />
        <Route
          path="/academics/courses/sessions/add/"
          element={<ClassSessionRegistrer />}
        />
        <Route
          path="/academics/courses/sessions/session/edition/:id"
          element={<ClassSessionEdition />}
        />
        <Route path="/students/student/:id" element={<StudentDetails />} />
        <Route path="/academics/academic/:id" element={<AcademicDetails />} />
        <Route
          path="/academics/resume/academic/:id"
          element={<AcademicShortDetails />}
        />
        <Route
          path="/students/student-edition/:id"
          element={<StudentEdition />}
        />
        <Route
          path="/academics/academic-edition/:id"
          element={<AcademicEdition />}
        />
        <Route path="/students/sign-up/" element={<StudentSignUp />} />
        <Route path="/academics/sign-up/" element={<AcademicSignUp />} />
        <Route path="*" element={<Navigate to="/login/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
