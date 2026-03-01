import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import UploadLecture from './pages/Admin/UploadLecture'
import Assignments from './pages/Admin/Assignments'
import PlagiarismChecker from './pages/Admin/PlagiarismChecker'
import ClassRankings from './pages/Admin/ClassRankings'
import QuizMaker from './pages/Admin/QuizMaker'
import AdminLearnerMap from './pages/Admin/AdminLearnerMap'
import NewAssignment from './pages/Admin/NewAssignment'
import StudentLayout from './pages/Student/StudentLayout'
import StudentDashboard from './pages/Student/StudentDashboard'
import LearnerMap from './pages/Student/LearnerMap'
import UploadSummary from './pages/Student/UploadSummary'
import MyMarks from './pages/Student/MyMarks'
import TopicInsights from './pages/Student/TopicInsights'

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />
    return children
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="upload" element={<UploadLecture />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="assignments/new" element={<NewAssignment />} />
                <Route path="plagiarism" element={<PlagiarismChecker />} />
                <Route path="rankings" element={<ClassRankings />} />
                <Route path="quiz" element={<QuizMaker />} />
                <Route path="learner-map" element={<AdminLearnerMap />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentLayout /></ProtectedRoute>}>
                <Route index element={<StudentDashboard />} />
                <Route path="learner-map" element={<LearnerMap />} />
                <Route path="summary" element={<UploadSummary />} />
                <Route path="marks" element={<MyMarks />} />
                <Route path="insights" element={<TopicInsights />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
