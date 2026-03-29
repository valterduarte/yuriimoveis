export default function AdminLogin({ username, password, onUsernameChange, onPasswordChange, onSubmit, loading, error }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">Acesso Admin</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={e => onUsernameChange(e.target.value)}
            autoComplete="username"
            required
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-xs disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
