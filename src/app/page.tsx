"use client"

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Calendar, 
  Users, 
  Apple, 
  TrendingUp, 
  Play, 
  Plus, 
  Crown,
  Clock,
  Target,
  Zap,
  Award,
  MessageCircle,
  BarChart3,
  Dumbbell,
  Heart
} from 'lucide-react'

interface Workout {
  id: string
  name: string
  duration: number
  calories: number
  date: string
  type: string
}

interface User {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  trialStartDate: string
  isPremium: boolean
}

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [showTrialModal, setShowTrialModal] = useState(false)

  // Initialize user and load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('rb-fitness-user')
    const savedWorkouts = localStorage.getItem('rb-fitness-workouts')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      // New user - start trial
      const newUser: User = {
        name: 'Usuário',
        level: 'beginner',
        trialStartDate: new Date().toISOString(),
        isPremium: false
      }
      setUser(newUser)
      localStorage.setItem('rb-fitness-user', JSON.stringify(newUser))
      setShowTrialModal(true)
    }

    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts))
    }
  }, [])

  // Check if trial has expired
  const isTrialExpired = () => {
    if (!user || user.isPremium) return false
    const trialStart = new Date(user.trialStartDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - trialStart.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 60 // 2 months = 60 days
  }

  const getDaysRemaining = () => {
    if (!user || user.isPremium) return 0
    const trialStart = new Date(user.trialStartDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - trialStart.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, 60 - diffDays)
  }

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout = { ...workout, id: Date.now().toString() }
    const updatedWorkouts = [...workouts, newWorkout]
    setWorkouts(updatedWorkouts)
    localStorage.setItem('rb-fitness-workouts', JSON.stringify(updatedWorkouts))
  }

  const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0)
  const totalWorkouts = workouts.length
  const avgDuration = workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length) : 0

  const workoutPlans = {
    beginner: [
      { name: 'Caminhada Matinal', duration: 30, type: 'cardio' },
      { name: 'Alongamento Básico', duration: 15, type: 'flexibility' },
      { name: 'Exercícios com Peso Corporal', duration: 20, type: 'strength' }
    ],
    intermediate: [
      { name: 'Corrida Intervalada', duration: 45, type: 'cardio' },
      { name: 'Treino de Força', duration: 60, type: 'strength' },
      { name: 'Yoga Flow', duration: 40, type: 'flexibility' }
    ],
    advanced: [
      { name: 'HIIT Intenso', duration: 30, type: 'cardio' },
      { name: 'Levantamento Pesado', duration: 90, type: 'strength' },
      { name: 'CrossTraining', duration: 60, type: 'mixed' }
    ]
  }

  const mealSuggestions = [
    { name: 'Smoothie Proteico', calories: 250, type: 'breakfast' },
    { name: 'Salada de Quinoa', calories: 350, type: 'lunch' },
    { name: 'Salmão Grelhado', calories: 400, type: 'dinner' },
    { name: 'Mix de Castanhas', calories: 150, type: 'snack' }
  ]

  if (isTrialExpired() && !user?.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Período Gratuito Expirado</h2>
          <p className="text-gray-600 mb-6">
            Seu período de 2 meses gratuitos terminou. Assine o R.B Premium para continuar sua jornada fitness!
          </p>
          <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-transform">
            Assinar Premium
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                R.B Fitness
              </h1>
            </div>
            
            {!user?.isPremium && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  {getDaysRemaining()} dias restantes
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'workouts', label: 'Treinos', icon: Dumbbell },
              { id: 'nutrition', label: 'Nutrição', icon: Apple },
              { id: 'community', label: 'Comunidade', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Treinos</p>
                    <p className="text-3xl font-bold text-gray-900">{totalWorkouts}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Calorias Queimadas</p>
                    <p className="text-3xl font-bold text-gray-900">{totalCalories}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                    <p className="text-3xl font-bold text-gray-900">{avgDuration}min</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => addWorkout({
                    name: 'Treino Rápido',
                    duration: 30,
                    calories: 200,
                    date: new Date().toISOString(),
                    type: 'cardio'
                  })}
                  className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:scale-105 transition-transform"
                >
                  <Play className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-700">Iniciar Treino</span>
                </button>

                <button className="flex flex-col items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:scale-105 transition-transform">
                  <Apple className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-700">Log Refeição</span>
                </button>

                <button className="flex flex-col items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:scale-105 transition-transform">
                  <Target className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-700">Definir Meta</span>
                </button>

                <button className="flex flex-col items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:scale-105 transition-transform">
                  <Users className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-700">Ver Comunidade</span>
                </button>
              </div>
            </div>

            {/* Recent Workouts */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Treinos Recentes</h3>
              {workouts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum treino registrado ainda. Comece sua jornada!</p>
              ) : (
                <div className="space-y-3">
                  {workouts.slice(-3).reverse().map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{workout.name}</p>
                          <p className="text-sm text-gray-500">{workout.duration}min • {workout.calories} cal</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Planos de Treino</h2>
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:scale-105 transition-transform flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Novo Treino</span>
              </button>
            </div>

            {/* Workout Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user && workoutPlans[user.level].map((plan, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {plan.duration} minutos
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      {plan.type}
                    </div>
                  </div>
                  <button 
                    onClick={() => addWorkout({
                      name: plan.name,
                      duration: plan.duration,
                      calories: plan.duration * 5,
                      date: new Date().toISOString(),
                      type: plan.type
                    })}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-xl font-medium hover:scale-105 transition-transform"
                  >
                    Iniciar Treino
                  </button>
                </div>
              ))}
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso Semanal</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {[...Array(7)].map((_, i) => {
                  const height = Math.random() * 200 + 50
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-orange-500 to-pink-500 rounded-t-lg"
                        style={{ height: `${height}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Acompanhamento Nutricional</h2>

            {/* Daily Goals */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metas Diárias</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <div className="w-full h-full bg-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ clipPath: 'polygon(0 0, 70% 0, 70% 100%, 0 100%)' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">70%</span>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">Calorias</p>
                  <p className="text-sm text-gray-500">1400 / 2000</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <div className="w-full h-full bg-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ clipPath: 'polygon(0 0, 85% 0, 85% 100%, 0 100%)' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">85%</span>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">Proteína</p>
                  <p className="text-sm text-gray-500">85g / 100g</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <div className="w-full h-full bg-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ clipPath: 'polygon(0 0, 60% 0, 60% 100%, 0 100%)' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">60%</span>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">Água</p>
                  <p className="text-sm text-gray-500">1.5L / 2.5L</p>
                </div>
              </div>
            </div>

            {/* Meal Suggestions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sugestões de Refeições</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mealSuggestions.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Apple className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{meal.name}</p>
                        <p className="text-sm text-gray-500">{meal.calories} calorias</p>
                      </div>
                    </div>
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Comunidade R.B</h2>

            {/* Challenges */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Desafios Ativos</h3>
              <div className="space-y-4">
                {[
                  { name: 'Desafio 30 Dias', participants: 1247, progress: 65, reward: '500 pontos' },
                  { name: 'Queima 5000 Calorias', participants: 892, progress: 80, reward: 'Badge Especial' },
                  { name: 'Treino Diário', participants: 2156, progress: 45, reward: '1 Mês Premium' }
                ].map((challenge, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{challenge.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{challenge.reward}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{challenge.participants} participantes</span>
                      <span className="text-sm font-medium text-purple-600">{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Feed */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feed da Comunidade</h3>
              <div className="space-y-4">
                {[
                  { user: 'Ana Silva', action: 'completou um treino de 45min', time: '2h atrás', likes: 12 },
                  { user: 'Carlos Santos', action: 'atingiu a meta de 10.000 passos', time: '4h atrás', likes: 8 },
                  { user: 'Maria Oliveira', action: 'compartilhou uma receita saudável', time: '6h atrás', likes: 15 }
                ].map((post, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{post.user[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{post.user}</span> {post.action}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{post.time}</span>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs">Comentar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Trial Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bem-vindo ao R.B Fitness!</h2>
            <p className="text-gray-600 mb-6">
              Você tem <span className="font-semibold text-orange-600">2 meses gratuitos</span> para explorar todas as funcionalidades do app!
            </p>
            <button 
              onClick={() => setShowTrialModal(false)}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Começar Jornada
            </button>
          </div>
        </div>
      )}
    </div>
  )
}