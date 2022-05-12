import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "./pages";
import { Challenge } from "./pages/challenge/challenge";
import { Challenges } from "./pages/challenge/challenges";
import { EditComment } from "./pages/comment/edit_comment";
import { Roles } from "./pages/roles";
import { AddSolution } from "./pages/solution/add_solution";
import { Review } from "./pages/solution/review";
import { Solutions } from "./pages/solution/solutions";

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path={"/frontend/"}>
        <Route index element={<Index />} />
        <Route path={"challenges"} element={<Challenges />} />
        <Route path={"challenges/user/:email"} element={<Challenges />} />
        <Route path={"challenge/new"} element={<Challenge />} />
        <Route path={"challenge/update/:id"} element={<Challenge />} />
        <Route path={"challenge/solve/:id"} element={<AddSolution />} />
        <Route path={"solutions/challenge/:id"} element={<Solutions />} />
        <Route path={"solution/review/:id"} element={<Review />} />
        <Route path={"solutions/user/:email"} element={<Solutions />} />
        <Route path={"comment/new/:type/:id"} element={<EditComment />} />
        <Route path={"comment/update/:commentid"} element={<EditComment />} />
        <Route path={"roles"} element={<Roles />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
