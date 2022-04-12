import * as React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Index} from "./pages";
import {Challenges} from "./pages/challenge/challenges";
import {Challenge} from "./pages/challenge/challenge";
import {Roles} from "./pages/roles";

export const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path={"/frontend/"}>
                <Route index element={<Index />}/>
                <Route path={"challenges"} element={<Challenges />}/>
                <Route path={"challenge/new"} element={<Challenge />}/>
                <Route path={"roles"} element={<Roles />}/>
            </Route>
        </Routes>
    </BrowserRouter>
)
