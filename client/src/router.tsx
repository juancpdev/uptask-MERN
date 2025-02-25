import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import DashboardView from "@/views/DashboardView"
import CreateProjectView from "./views/projects/CreateProjectView"
import EditProjecView from "./views/projects/EditProjecView"

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<AppLayout/>}>
                <Route path='/' element={<DashboardView/>} index />
                <Route path='/projects/create' element={<CreateProjectView/>} />
                <Route path='/projects/:projectId/edit' element={<EditProjecView/>} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}
