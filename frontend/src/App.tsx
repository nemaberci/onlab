import * as React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Index} from "./pages";
import {Challenges} from "./pages/challenge/challenges";
import {Challenge} from "./pages/challenge/challenge";
import {Roles} from "./pages/roles";
import { Solve } from "./pages/solution/solve";
import { AddSolution } from "./pages/solution/add_solution";
import { Review } from "./pages/solution/review";
import { SolutionComments } from "./pages/comment/solution_comments";
import { ChallengeComments } from "./pages/comment/challenge_comments";
import { EditComment } from "./pages/comment/edit_comment";

export const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path={"/frontend/"}>
                <Route index element={<Index />}/>
                <Route path={"challenges"} element={<Challenges />}/>
                <Route path={"challenge/new"} element={<Challenge />}/>
                <Route path={"challenge/update/:id"} element={<Challenge />}/>
                <Route path={"challenge/solutions/:id"} element={<Solve />} />
                <Route path={"challenge/solve/:id"} element={<AddSolution />} />
                <Route path={"solution/review/:id"} element={<Review />} />
                <Route path={"comment/solution/:id"} element={<SolutionComments />} />
                <Route path={"comment/challenge/:id"} element={<ChallengeComments />} />
                <Route path={"comment/new/:type/:id"} element={<EditComment />} />
                <Route path={"comment/update/:commentid"} element={<EditComment />} />
                <Route path={"roles"} element={<Roles />}/>
            </Route>
        </Routes>
    </BrowserRouter>
)
