import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout } from '../components/Layout'
const API_URL = 'https://fadj-ma-api.onrender.com/api';

function AuthHeader({ active }) {
  return (
    <div className="bg-slate-800 py-6 px-8">
      <p className="text-white text-lg font-medium mb-1">Bienvenue chez votre pharmacie</p>
      <div className="flex items-center gap-2 text-white font-bold text-xl mb-5">
        <img src="https://fadj-ma-api.onrender.com/images/logo-fadjma.png" alt="Fadj-Ma" className="w-7 h-7" />
        Fadj-Ma
      </div>
      <div className="flex gap-3">
        <Link
          to="/"
          className={`px-6 py-2 rounded font-medium ${active === 'login' ? 'bg-teal-400 text-slate-900' : 'bg-slate-700 text-white'}`}
        >
          Connectez-vous
        </Link>
        <Link
          to="/register"
          className={`px-6 py-2 rounded font-medium ${active === 'register' ? 'bg-teal-400 text-slate-900' : 'bg-slate-700 text-white'}`}
        >
          Inscrivez-vous
        </Link>
      </div>
    </div>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 403) {
        navigate('/verify', { state: { email } });
        return;
      }
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden">
        <AuthHeader active="login" />
        <form onSubmit={handleSubmit} className="p-8">
          {error && <p className="text-red-500 mb-3">{error}</p>}

          <label className="block font-medium mb-1">Adresse e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />

          <label className="block font-medium mb-1">Mot de passe</label>
          <div className="relative mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <Link to="/forgot-password" className="text-sm text-teal-600 text-right block mb-4">
            Mot de passe oublie ?
          </Link>

          <button type="submit" disabled={loading} className="bg-teal-400 text-slate-900 font-medium w-full py-2 rounded disabled:opacity-60">
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function Register() {
  const [genre, setGenre] = useState('');
  const [prenom, setPrenom] = useState('');
  const [name, setName] = useState('');
  const [jour, setJour] = useState('');
  const [mois, setMois] = useState('');
  const [annee, setAnnee] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: `${prenom.trim()} ${name.trim()}`.trim(),
        email: email.trim(),
        genre,
        date_naissance: jour && mois && annee ? `${jour}/${mois}/${annee}` : null,
      });
      navigate('/verify', { state: { email: email.trim() } });
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      setError(
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        "Erreur lors de l'inscription. Vérifiez vos informations et réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg overflow-hidden">
        <AuthHeader active="register" />

        <form onSubmit={handleSubmit} className="p-8">
          {error && <p className="text-red-500 mb-3">{error}</p>}

          <p className="font-medium mb-2">Vos coordonnées</p>

          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="genre" value="Homme" checked={genre === 'Homme'} onChange={(e) => setGenre(e.target.value)} />
              Homme
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="genre" value="Femme" checked={genre === 'Femme'} onChange={(e) => setGenre(e.target.value)} />
              Femme
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Prénom</label>
              <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="border p-2 w-full rounded" />
            </div>
            <div>
              <label className="block font-medium mb-1">Nom</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full rounded" />
            </div>
          </div>

          <label className="block font-medium mb-1">Date de naissance</label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <select value={jour} onChange={(e) => setJour(e.target.value)} className="border p-2 rounded">
              <option value="">JJ</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select value={mois} onChange={(e) => setMois(e.target.value)} className="border p-2 rounded">
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select value={annee} onChange={(e) => setAnnee(e.target.value)} className="border p-2 rounded">
              <option value="">AAAA</option>
              {Array.from({ length: 80 }, (_, i) => 2026 - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <label className="block font-medium mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />

          <p className="text-sm text-gray-500 mb-4">
            Un code de vérification vous sera envoyé par email.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-400 text-slate-900 font-medium w-full py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
export function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || done) return;
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, { email, code: code.trim() });
      setDone(true);
      setInfo('Compte validé ! Votre mot de passe temporaire a été envoyé par email. Redirection...');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(
        err.response?.data?.errors?.code?.[0] ||
        err.response?.data?.message ||
        'Erreur lors de la vérification'
      );
    } finally {
      setLoading(false);
    }
  };

  const renvoyer = async () => {
    setError('');
    setInfo('');
    try {
      await axios.post(`${API_URL}/auth/resend-otp`, { email });
      setInfo('Un nouveau code a été envoyé.');
    } catch {
      setError("Impossible d'envoyer le code. Réessayez dans un instant.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden">
        <AuthHeader active="register" />
        <form onSubmit={handleSubmit} className="p-8">
          <p className="font-medium mb-1">Vérification de votre email</p>
          <p className="text-sm text-gray-500 mb-4">
            Un code à 6 chiffres a été envoyé à {email}
          </p>

          {error && <p className="text-red-500 mb-3">{error}</p>}
          {info && <p className="text-green-600 mb-3">{info}</p>}

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            className="border p-2 w-full mb-4 rounded text-center text-xl tracking-widest"
          />

          <button
            type="submit"
            disabled={loading || done}
            className="bg-teal-400 text-slate-900 font-medium w-full py-2 rounded disabled:opacity-60"
          >
            {loading ? 'Vérification...' : 'Valider'}
          </button>

          <button type="button" onClick={renvoyer} className="text-sm text-teal-600 w-full mt-3">
            Renvoyer le code
          </button>
        </form>
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const envoyerCode = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email: email.trim() });
      setInfo('Si ce compte existe, un code vient de vous être envoyé par email.');
      setStep(2);
    } catch {
      setError('Erreur, réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const reinitialiser = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email: email.trim(),
        code: code.trim(),
        password,
        password_confirmation: confirm,
      });
      setInfo('Mot de passe modifié ! Redirection...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? Object.values(errs)[0][0] : 'Erreur, réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden">
        <AuthHeader active="login" />
        <form onSubmit={step === 1 ? envoyerCode : reinitialiser} className="p-8">
          <p className="font-medium mb-4">Mot de passe oublié</p>

          {error && <p className="text-red-500 mb-3">{error}</p>}
          {info && <p className="text-green-600 mb-3">{info}</p>}

          {step === 1 ? (
            <>
              <label className="block font-medium mb-1">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code à 6 chiffres"
                className="border p-2 w-full mb-3 rounded"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nouveau mot de passe (8 caractères minimum)"
                className="border p-2 w-full mb-3 rounded"
              />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirmer le mot de passe"
                className="border p-2 w-full mb-4 rounded"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-400 text-slate-900 font-medium w-full py-2 rounded disabled:opacity-60"
          >
            {loading ? 'Patientez...' : step === 1 ? 'Envoyer le code' : 'Changer le mot de passe'}
          </button>

          <Link to="/" className="text-sm text-teal-600 block text-center mt-3">
            Retour à la connexion
          </Link>
        </form>
      </div>
    </div>
  );
}

function telechargerRapport(stats) {
  const lignes = [
    ['Indicateur', 'Valeur'],
    ['Statut inventaire', stats.statutInventaire],
    ['Revenu du mois (FCFA)', stats.revenuMois],
    ['Medicaments disponibles', stats.medicamentsDisponibles],
    ['Penurie de medicaments', stats.penurieMedicaments],
    ['Total clients', stats.totalClients],
    ['Total fournisseurs', stats.totalFournisseurs],
    ['Factures generees', stats.facturesGenerees],
  ];
  const contenu = lignes.map((ligne) => ligne.join(';')).join('\n');
  const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = 'rapport-fadj-ma.csv';
  lien.click();
  URL.revokeObjectURL(url);
}

export function Dashboard() {
  function CountUp({ end, duration = 1200, pad = 0 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let frame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  const formatted = pad
    ? String(value).padStart(pad, '0')
    : value.toLocaleString('fr-FR').replace(/\s/g, '.');

  return <>{formatted}</>;
}
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/dashboard`)
      .then((response) => setStats(response.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Tableau de bord</h1>
            <p className="text-gray-500">Un apercu rapide des donnees de votre pharmacie</p>
          </div>
          <button onClick={() => stats && telechargerRapport(stats)} className="border rounded px-4 py-2 bg-white">
            Telecharger le rapport
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-green-400 rounded overflow-hidden">
            <div className="p-4">
              <img src="https://fadj-ma-api.onrender.com/images/icon-inventaire.png" alt="" className="w-8 h-8 mb-2" />
              <p className="text-xl font-bold">Bien</p>
              <p className="text-sm text-gray-500">Statut de l'inventaire</p>
            </div>
            <div className="bg-green-100 text-green-700 text-sm px-4 py-2">Afficher le rapport detaille »</div>
          </div>

          <div className="bg-white border-2 border-yellow-400 rounded overflow-hidden">
            <div className="p-4">
              <img src="https://fadj-ma-api.onrender.com/images/icon-revenu.png" alt="" className="w-8 h-8 mb-2" />
              <p className="text-xl font-bold"><CountUp end={4800432} /> FCFA</p>
              <p className="text-sm text-gray-500">Revenu : janvier 2022</p>
            </div>
            <div className="bg-yellow-100 text-yellow-700 text-sm px-4 py-2">Afficher le rapport detaille »</div>
          </div>

          <div className="bg-white border-2 border-blue-400 rounded overflow-hidden">
            <div className="p-4">
              <img src="https://fadj-ma-api.onrender.com/images/icon-medicaments.png" alt="" className="w-8 h-8 mb-2" />
              <p className="text-xl font-bold"><CountUp end={298} /></p>
              <p className="text-sm text-gray-500">Medicaments disponibles</p>
            </div>
            <div className="bg-blue-100 text-blue-700 text-sm px-4 py-2">Visiter l'inventaire »</div>
          </div>

          <div className="bg-white border-2 border-red-400 rounded overflow-hidden">
            <div className="p-4">
              <p className="text-2xl mb-2">⚠️</p>
              <p className="text-xl font-bold">01</p>
              <p className="text-sm text-gray-500">Penurie de medicaments</p>
            </div>
            <div className="bg-red-100 text-red-700 text-sm px-4 py-2">Resoudre maintenant »</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded shadow p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Inventaire</h2>
              <span className="text-sm text-gray-500">Allez dans Configuration »</span>
            </div>
            <div className="flex gap-20">
              <div>
                <p className="text-2xl font-bold"><CountUp end={298} /></p>
                <p className="text-sm text-gray-500">Nombre total de medicaments</p>
              </div>
              <div>
                <p className="text-2xl font-bold"><CountUp end={24} /></p>
                <p className="text-sm text-gray-500">Groupes de medecine</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Rapport rapide</h2>
              <span className="text-sm text-gray-500">Janvier 2022</span>
            </div>
            <div className="flex gap-20">
              <div>
                <p className="text-2xl font-bold"><CountUp end={70856} /></p>
                <p className="text-sm text-gray-500">Quantite de medicaments vendus</p>
              </div>
              <div>
                <p className="text-2xl font-bold"><CountUp end={5288} /></p>
                <p className="text-sm text-gray-500">Factures generees</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Ma pharmacie</h2>
              <span className="text-sm text-gray-500">Accedez a la gestion des utilisateurs »</span>
            </div>
            <div className="flex gap-20">
              <div>
                <p className="text-2xl font-bold"><CountUp end={4} pad={2} /></p>
                <p className="text-sm text-gray-500">Nombre total de fournisseurs</p>
              </div>
              <div>
                <p className="text-2xl font-bold"><CountUp end={5} pad={2} /></p>
                <p className="text-sm text-gray-500">Nombre total d'utilisateurs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Clients</h2>
              <span className="text-sm text-gray-500">Aller a la page clients »</span>
            </div>
            <div className="flex gap-20">
              <div>
                <p className="text-2xl font-bold"><CountUp end={845} /></p>
                <p className="text-sm text-gray-500">Nombre total de clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold">Adalimumab</p>
                <p className="text-sm text-gray-500">Article frequemment vendu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const navigate = useNavigate();

  const fetchMedicines = () => {
    axios.get(`${API_URL}/medicines`)
      .then((response) => setMedicines(response.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMedicines();
    axios.get(`${API_URL}/groups`)
      .then((response) => setGroups(response.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce medicament ?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMedicines();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const matchSearch = medicine.nom.toLowerCase().includes(search.toLowerCase());
    const matchGroup = selectedGroup === '' || (medicine.group && medicine.group.id === parseInt(selectedGroup));
    return matchSearch && matchGroup;
  });

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Medicaments ({filteredMedicines.length})</h1>
            <p className="text-gray-500 text-sm">Liste des medicaments disponibles a la vente.</p>
          </div>
          <Link to="/medicines/new" className="bg-slate-800 text-white px-4 py-2 rounded">
            + Nouveau medicament
          </Link>
        </div>

        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="relative w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Rechercher dans l'inventaire des medicaments."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded pl-9 pr-4 py-2 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">Selectionnez un groupe</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Nom du medicament</th>
              <th className="p-3">Code</th>
              <th className="p-3">Groupe</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine.id} className="border-t">
                <td className="p-3">{medicine.nom}</td>
                <td className="p-3">{medicine.code_medicament}</td>
                <td className="p-3">{medicine.group ? medicine.group.nom : '-'}</td>
                <td className="p-3 flex items-center gap-3">
  <Link
  to={`/medicines/${medicine.id}`}
  className="text-teal-600 hover:underline font-medium"
>
  Voir détails
  </Link>
  <button onClick={() => navigate(`/medicines/${medicine.id}/edit`)} className="text-blue-600" title="Modifier">✏️</button>
  <button onClick={() => handleDelete(medicine.id)} className="text-red-600" title="Supprimer">🗑️</button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}


export function MedicineDetail() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const IMAGE_URL = "https://fadj-ma-api.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_URL}/medicines/${id}`)
      .then((response) => setMedicine(response.data))
      .catch((err) => console.error(err));

    axios
      .get(`${API_URL}/medicines`)
      .then((response) => setMedicines(response.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Suppression du médicament après confirmation dans le modal
  const handleDelete = async () => {
    if (deleting) return;

    setDeleting(true);

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API_URL}/medicines/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowDeleteModal(false);
      navigate("/medicines");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du médicament.");
      setDeleting(false);
    }
  };

  if (!medicine) {
    return (
      <Layout>
        <p className="p-8">Chargement...</p>
      </Layout>
    );
  }

  const imageUrl = medicine.photo_url
    ? `${IMAGE_URL}/${medicine.photo_url}`
    : "https://via.placeholder.com/500x500?text=Pas+de+photo";

  return (
    <Layout>
      <div className="min-h-screen bg-[#eef3f7] p-6 md:p-8">

        {/* Fil d'Ariane */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            <Link to="/medicines" className="hover:text-gray-800">
              Médicaments
            </Link>

            <span className="mx-2">›</span>

            <span className="font-semibold text-gray-800">
              Tous les détails
            </span>
          </p>
        </div>

        {/* Image et informations */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 items-start">

          {/* Image du médicament avec flèches désactivées */}
          <div className="flex items-center gap-4">

            <button
              type="button"
              disabled
              className="text-5xl leading-none text-gray-300 cursor-not-allowed"
              aria-label="Médicament précédent"
            >
              ‹
            </button>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="w-full h-[300px] md:h-[360px] flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={medicine.nom}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <button
              type="button"
              disabled
              className="text-5xl leading-none text-gray-300 cursor-not-allowed"
              aria-label="Médicament suivant"
            >
              ›
            </button>

          </div>

          {/* Informations du médicament */}
          <div className="pt-2">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {medicine.nom}
            </h1>

            {medicine.code_medicament && (
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  Code du médicament
                </h2>
                <p className="text-sm text-gray-600">
                  {medicine.code_medicament}
                </p>
              </div>
            )}

            {medicine.composition && (
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  Composition
                </h2>
                <p className="text-sm text-gray-600">
                  {medicine.composition}
                </p>
              </div>
            )}

            {medicine.fabricant && (
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  Fabricant / commerçant
                </h2>
                <p className="text-sm text-gray-600">
                  {medicine.fabricant}
                </p>
              </div>
            )}

            {medicine.type_consommation && (
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  Type de consommation
                </h2>
                <p className="text-sm text-gray-600">
                  {medicine.type_consommation}
                </p>
              </div>
            )}

            {medicine.date_expiration && (
              <div className="mb-8">
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  Date d'expiration
                </h2>
                <p className="text-sm text-gray-600">
                  {medicine.date_expiration}
                </p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex items-center gap-4 mt-6">

              <button
                type="button"
                onClick={() => navigate(`/medicines/${id}/edit`)}
                className="text-blue-600 hover:scale-110 transition"
                title="Modifier"
                aria-label="Modifier le médicament"
              >
                ✏️
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:scale-110 transition"
                title="Supprimer"
                aria-label="Supprimer le médicament"
              >
                🗑️
              </button>

            </div>
          </div>
        </div>

        {/* Description */}
        {medicine.description && (
          <div className="mt-12 max-w-6xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Description :
            </h2>

            <div className="text-sm leading-7 text-gray-600 whitespace-pre-line">
              {medicine.description}
            </div>
          </div>
        )}

        {/* Dosage et posologie */}
        {medicine.dosage_posologie && (
          <div className="mt-10 max-w-6xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Dosage et posologie :
            </h2>

            <div className="text-sm leading-7 text-gray-600 whitespace-pre-line">
              {medicine.dosage_posologie}
            </div>
          </div>
        )}

      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                🗑️
              </div>

              <h2
                id="delete-modal-title"
                className="text-xl font-bold text-gray-900"
              >
                Confirmer la suppression
              </h2>

              <p className="mt-3 text-gray-600">
                Êtes-vous sûr de vouloir supprimer ce médicament ?
              </p>

              <p className="mt-2 font-semibold text-gray-900">
                {medicine.nom}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Cette action est irréversible.
              </p>

            </div>

            <div className="mt-6 flex justify-center gap-3">

              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Suppression..." : "Oui, supprimer"}
              </button>

            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}


export function EditMedicine() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/medicines/${id}`)
      .then((response) => setFormData(response.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/medicines/${id}`, {
        nom: formData.nom,
        code_medicament: formData.code_medicament,
        stock: parseInt(formData.stock),
        seuil_alerte: parseInt(formData.seuil_alerte),
        photo_url: formData.photo_url,
        description: formData.description
      });

      setSuccess(true);

      setTimeout(() => {
        navigate(`/medicines/${id}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modification');
    }
  };

  if (!formData) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#eef3f7] p-8">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </Layout>
    );
  }

  const imageUrl = formData.photo_url
    ? `https://fadj-ma-api.onrender.com/${formData.photo_url}`
    : null;

  return (
    <Layout>
      <div className="min-h-screen bg-[#eef3f7] p-6 md:p-8">

        {/* TITRE */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Modifier le médicament
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Modifiez les informations du médicament
          </p>
        </div>

        {/* GRANDE CARTE */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden"
        >

          {/* ZONE IMAGE */}
          <div className="bg-[#eef2f5] border-b border-gray-200">

            {imageUrl ? (
              <div className="h-[260px] flex items-center justify-center p-6">
                <img
                  src={imageUrl}
                  alt={formData.nom}
                  className="max-h-[220px] max-w-[300px] object-contain"
                />
              </div>
            ) : (
              <div className="h-[260px] flex flex-col items-center justify-center">

                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-4xl text-gray-500">
                    +
                  </span>
                </div>

                <p className="text-lg font-semibold text-gray-800">
                  Ajouter une image
                </p>

              </div>
            )}

          </div>

          {/* CONTENU DU FORMULAIRE */}
          <div className="p-8 md:p-10">

            {/* SECTION OBLIGATOIRE */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900">
                Informations du médicament
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Donnez plus de détails possible
              </p>
            </div>

            {/* CHAMPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NOM */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Nom du médicament
                </label>

                <input
                  type="text"
                  value={formData.nom || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nom: e.target.value
                    })
                  }
                  placeholder="Nom du médicament"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* CODE */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Code médicament
                </label>

                <input
                  type="text"
                  value={formData.code_medicament || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code_medicament: e.target.value
                    })
                  }
                  placeholder="Code médicament"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Stock disponible
                </label>

                <input
                  type="number"
                  value={formData.stock ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: e.target.value
                    })
                  }
                  placeholder="Stock"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* SEUIL */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Seuil d'alerte
                </label>

                <input
                  type="number"
                  value={formData.seuil_alerte ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seuil_alerte: e.target.value
                    })
                  }
                  placeholder="Seuil d'alerte"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* PHOTO */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Photo du médicament
                </label>

                <input
                  type="text"
                  value={formData.photo_url || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      photo_url: e.target.value
                    })
                  }
                  placeholder="URL ou chemin de la photo"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description
                </label>

                <textarea
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value
                    })
                  }
                  placeholder="Description"
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

            </div>

            {/* MESSAGE SUCCÈS */}
            {success && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                Médicament modifié avec succès !
              </div>
            )}

            {/* BOUTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

              <button
                type="button"
                onClick={() => navigate(`/medicines/${id}`)}
                className="w-full h-12 border border-gray-400 rounded-lg bg-white text-gray-800 font-medium hover:bg-gray-50 transition"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-[#9bdcf5] text-gray-900 font-semibold hover:bg-[#82d2ef] transition"
              >
                Enregistrer
              </button>

            </div>

          </div>
        </form>
      </div>
    </Layout>
  );
}

export function NewMedicine() {
  const [nom, setNom] = useState('');
  const [code_medicament, setCode] = useState('');
  const [stock, setStock] = useState('');
  const [seuil_alerte, setSeuil] = useState('');
  const [medicine_group_id, setGroupId] = useState('');
  const [description, setDescription] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!imageFile) {
      alert('Veuillez ajouter une image du médicament.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append('nom', nom);
      data.append('code_medicament', code_medicament);
      data.append('stock', stock);
      data.append('seuil_alerte', seuil_alerte);
      data.append('medicine_group_id', medicine_group_id);
      data.append('description', description);
      data.append('photo', imageFile);

      await axios.post(
        `${API_URL}/medicines`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      navigate('/medicines');

    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        console.error(err.response.data);
      }

      alert('Erreur lors de la création du médicament');

    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#eef3f7] p-6 md:p-8">

        {/* TITRE */}
        <div className="mb-6">
          
        </div>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl mx-auto bg-white rounded-xl overflow-hidden shadow-sm"
        >

          {/* AJOUT IMAGE */}
          <label
            htmlFor="medicine-image"
            className="h-[280px] bg-[#eef2f5] border-b border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-[#e7edf1] transition"
          >

            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Aperçu du médicament"
                  className="h-[190px] max-w-[320px] object-contain"
                />

                <p className="mt-3 text-sm font-medium text-gray-600">
                  Cliquer pour changer l'image
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-5xl font-light text-gray-600">
                    +
                  </span>
                </div>

                <p className="text-lg font-semibold text-gray-800">
                  Ajouter une image
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Cliquez ici pour choisir une image
                </p>
              </>
            )}

            <input
              id="medicine-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

          </label>

          {/* CONTENU */}
          <div className="p-8 md:p-10">

            {/* SECTION */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900">
                Obligatoire
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Donnez plus de détails possible
              </p>
            </div>

            {/* CHAMPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

              {/* NOM */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Nom du médicament
                </label>

                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom du médicament"
                  required
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description
                </label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description du médicament"
                  required
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* CODE */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Code médicament
                </label>

                <input
                  type="text"
                  value={code_medicament}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex : MED-001"
                  required
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Stock disponible
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Ex : 100"
                  required
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* SEUIL */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Seuil d'alerte
                </label>

                <input
                  type="number"
                  min="0"
                  value={seuil_alerte}
                  onChange={(e) => setSeuil(e.target.value)}
                  placeholder="Ex : 20"
                  required
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* GROUPE */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Groupe du médicament
                </label>

                <input
                  type="number"
                  min="1"
                  value={medicine_group_id}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="ID du groupe"
                  required
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

            </div>

            {/* BOUTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">

              <button
                type="button"
                onClick={() => navigate('/medicines')}
                disabled={loading}
                className="h-12 border border-gray-400 rounded-lg bg-white text-gray-800 font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-lg bg-[#9bdcf5] text-gray-900 font-semibold hover:bg-[#82d2ef] transition disabled:opacity-60"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>

            </div>

          </div>
        </form>
      </div>
    </Layout>
  );
}