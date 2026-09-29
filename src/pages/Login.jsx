import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout } from '../components/Layout';

const API_URL = 'https://fadj-ma-api.onrender.com/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Connexion</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mb-3 rounded" />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full mb-3 rounded" />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Se connecter</button>
      </form>
    </div>
  );
}

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l inscription');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Inscription</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full mb-3 rounded" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mb-3 rounded" />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full mb-3 rounded" />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">S'inscrire</button>
      </form>
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
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/dashboard`)
      .then((response) => setStats(response.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) {
    return <Layout><p className="p-8">Chargement...</p></Layout>;
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Tableau de bord</h1>
            <p className="text-gray-500">Un apercu rapide des donnees de votre pharmacie</p>
          </div>
          <button onClick={() => telechargerRapport(stats)} className="border rounded px-4 py-2 bg-white">
            Telecharger le rapport
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-green-400 rounded overflow-hidden">
            <div className="p-4">
              <p className="text-2xl mb-2">🛡️</p>
              <p className="text-xl font-bold">{stats.statutInventaire}</p>
              <p className="text-sm text-gray-500">Statut de l'inventaire</p>
            </div>
            <div className="bg-green-100 text-green-700 text-sm px-4 py-2">Afficher le rapport detaille &raquo;</div>
          </div>
          <div className="bg-white border-2 border-yellow-400 rounded overflow-hidden">
            <div className="p-4">
              <p className="text-2xl mb-2">💰</p>
              <p className="text-xl font-bold">{stats.revenuMois} 4800432FCFA</p>
              <p className="text-sm text-gray-500">Revenu</p>
            </div>
            <div className="bg-yellow-100 text-yellow-700 text-sm px-4 py-2">Afficher le rapport detaille &raquo;</div>
          </div>
          <div className="bg-white border-2 border-blue-400 rounded overflow-hidden">
            <div className="p-4">
              <p className="text-2xl mb-2">🏥</p>
              <p className="text-xl font-bold">{stats.medicamentsDisponibles} 298</p>
              <p className="text-sm text-gray-500">Medicaments disponibles</p>
            </div>
            <div className="bg-blue-100 text-blue-700 text-sm px-4 py-2">Visiter l'inventaire &raquo;</div>
          </div>
          <div className="bg-white border-2 border-red-400 rounded overflow-hidden">
            <div className="p-4">
              <p className="text-2xl mb-2">⚠️</p>
              <p className="text-xl font-bold">{stats.penurieMedicaments}</p>
              <p className="text-sm text-gray-500">Penurie de medicaments</p>
            </div>
            <div className="bg-red-100 text-red-700 text-sm px-4 py-2">Resoudre maintenant &raquo;</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded shadow p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Inventaire</h2>
              <span className="text-sm text-gray-500">Allez dans Configuration &raquo;</span>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-2xl font-bold">{stats.medicamentsDisponibles}</p>
                <p className="text-sm text-gray-500">Nombre total de medicaments</p>
              </div>
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-gray-500">Groupes de medecine</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Rapport rapide</h2>
              <span className="text-sm text-gray-500">Ce mois</span>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-gray-500">Quantite de medicaments vendus</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.facturesGenerees}</p>
                <p className="text-sm text-gray-500">Factures generees</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Ma pharmacie</h2>
              <span className="text-sm text-gray-500">Accedez a la gestion des utilisateurs &raquo;</span>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-2xl font-bold">{stats.totalFournisseurs}</p>
                <p className="text-sm text-gray-500">Nombre total de fournisseurs</p>
              </div>
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-gray-500">Nombre total d'utilisateurs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Clients</h2>
              <span className="text-sm text-gray-500">Aller a la page clients &raquo;</span>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
                <p className="text-sm text-gray-500">Nombre total de clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-gray-500">Article frequemment...</p>
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
            <span className="text-gray-400"></span>
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
                <td className="p-3">{medicine.stock}</td>
                <td className="p-3 space-x-3">
                  <Link to={`/medicines/${medicine.id}`} className="text-teal-600">
                    Voir tous les details &raquo;
                  </Link>
                  <button onClick={() => navigate(`/medicines/${medicine.id}/edit`)} className="text-blue-600">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(medicine.id)} className="text-red-600">
                    Supprimer
                  </button>
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
  const navigate = useNavigate();

  const IMAGE_URL = 'https://fadj-ma-api.onrender.com';

  useEffect(() => {
    axios.get(`${API_URL}/medicines/${id}`)
      .then((response) => setMedicine(response.data))
      .catch((err) => console.error(err));

    axios.get(`${API_URL}/medicines`)
      .then((response) => setMedicines(response.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce médicament ?')) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${API_URL}/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/medicines');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  if (!medicine) {
    return <Layout><p className="p-8">Chargement...</p></Layout>;
  }

  const currentIndex = medicines.findIndex(
    (item) => item.id === medicine.id
  );

  const previousMedicine =
    currentIndex > 0 ? medicines[currentIndex - 1] : null;

  const nextMedicine =
    currentIndex >= 0 && currentIndex < medicines.length - 1
      ? medicines[currentIndex + 1]
      : null;

  const imageUrl = medicine.photo_url
    ? `${IMAGE_URL}/${medicine.photo_url}`
    : 'https://via.placeholder.com/500x500?text=Pas+de+photo';

  return (
    <Layout>
      <div className="min-h-screen bg-[#eef3f7] p-6 md:p-8">

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 items-start">

          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={!previousMedicine}
              onClick={() => {
                if (previousMedicine) {
                  navigate(`/medicines/${previousMedicine.id}`);
                }
              }}
              className={`text-5xl leading-none transition ${
                previousMedicine
                  ? 'text-gray-900 hover:scale-110'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
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
              disabled={!nextMedicine}
              onClick={() => {
                if (nextMedicine) {
                  navigate(`/medicines/${nextMedicine.id}`);
                }
              }}
              className={`text-5xl leading-none transition ${
                nextMedicine
                  ? 'text-gray-900 hover:scale-110'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Médicament suivant"
            >
              ›
            </button>
          </div>

          <div className="pt-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {medicine.nom}
            </h1>

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
                  Fabricant/commerçant
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(`/medicines/${id}/edit`)}
                className="bg-[#1f2937] text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

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
    </Layout>
  );
}

export function EditMedicine() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/medicines/${id}`)
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
      navigate(`/medicines/${id}`);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modification');
    }
  };

  if (!formData) {
    return <Layout><p className="p-8">Chargement...</p></Layout>;
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Modifier {formData.nom}</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md">
          <input placeholder="Nom" value={formData.nom || ''} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="border p-2 w-full mb-3 rounded" />
          <input placeholder="Code medicament" value={formData.code_medicament || ''} onChange={(e) => setFormData({ ...formData, code_medicament: e.target.value })} className="border p-2 w-full mb-3 rounded" />
          <input type="number" placeholder="Stock" value={formData.stock || ''} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="border p-2 w-full mb-3 rounded" />
          <input type="number" placeholder="Seuil d'alerte" value={formData.seuil_alerte || ''} onChange={(e) => setFormData({ ...formData, seuil_alerte: e.target.value })} className="border p-2 w-full mb-3 rounded" />
          <input placeholder="URL de la photo" value={formData.photo_url || ''} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} className="border p-2 w-full mb-3 rounded" />
          <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border p-2 w-full mb-3 rounded" rows={4} />
          <div className="flex gap-2">
            <button type="submit" className="bg-slate-800 text-white flex-1 py-2 rounded">Enregistrer</button>
            <button type="button" onClick={() => navigate(`/medicines/${id}`)} className="border flex-1 py-2 rounded">Annuler</button>
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
  const [photo_url, setPhoto] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/medicines`, {
        nom,
        code_medicament,
        stock: parseInt(stock),
        seuil_alerte: parseInt(seuil_alerte),
        medicine_group_id: parseInt(medicine_group_id),
        photo_url,
        description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/medicines');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Nouveau medicament</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md">
          <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="border p-2 w-full mb-3 rounded" />
          <input placeholder="Code medicament" value={code_medicament} onChange={(e) => setCode(e.target.value)} className="border p-2 w-full mb-3 rounded" />
          <input placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="border p-2 w-full mb-3 rounded" />
          <input placeholder="Seuil d'alerte" type="number" value={seuil_alerte} onChange={(e) => setSeuil(e.target.value)} className="border p-2 w-full mb-3 rounded" />
          <input placeholder="ID du groupe" type="number" value={medicine_group_id} onChange={(e) => setGroupId(e.target.value)} className="border p-2 w-full mb-3 rounded" />
          <input placeholder="URL de la photo" value={photo_url} onChange={(e) => setPhoto(e.target.value)} className="border p-2 w-full mb-3 rounded" />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mb-3 rounded" rows={4} />
          <button type="submit" className="bg-slate-800 text-white w-full py-2 rounded">Creer</button>
        </form>
      </div>
    </Layout>
  );
}