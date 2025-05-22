import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { Toaster } from '@/components/ui/sonner'
import Header from "./components/layout/Header"
import ShowingMovies from "./components/layout/ShowingMovies"
import MoviePoster from "./components/layout/MoviePoster"
import Afisha from "./components/layout/Afisha"
import Schedule from "./components/layout/Schedule"
import MovieDetails from "./components/layout/MovieDetails"
import Booking from "./components/layout/Booking"
import Halls from "./components/layout/Halls"
import Profile from "./components/layout/Profile"
import { ProtectedRoute } from "./ProtectedRoute"

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-cinema-primary text-cinema-text">
          <Header />
          <div className="flex flex-1">
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <ShowingMovies />
                      <MoviePoster />
                    </>
                  }
                />
                <Route path="/afisha" element={<Afisha />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/halls" element={<Halls />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/booking/:scheduleId" element={<Booking />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="*"
                  element={
                    <div className="p-8 text-center text-2xl">
                      Страница не найдена. <Link to="/" className="text-cinema-accent">На главную</Link>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster 
          position="top-center"
          toastOptions={{
            classNames: {
              toast: 'bg-black border border-gray-700 text-white',
              title: 'text-white',
              description: 'text-gray-300',
              error: 'bg-black border-red-500',
              success: 'bg-black border-green-500',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App