import React, { useState } from 'react';
import { Calendar, Users, Briefcase, Plus, ChevronLeft, ChevronRight, X, Trash2, Edit2 } from 'lucide-react';

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1));
  
  const [consultants, setConsultants] = useState([
    { id: 1, nom: 'Marie Dupont', competences: ['SAP FI/CO', 'S/4HANA'], couleur: '#3b82f6' },
    { id: 2, nom: 'Jean Martin', competences: ['Oracle ERP', 'Cloud'], couleur: '#10b981' },
    { id: 3, nom: 'Sophie Bernard', competences: ['SAP MM', 'Logistique'], couleur: '#f59e0b' },
  ]);

  const [projets, setProjets] = useState([
    { id: 1, nom: 'Migration SAP S/4', client: 'TechCorp' },
    { id: 2, nom: 'Impl. Oracle Cloud', client: 'Industrie SA' },
  ]);

  const [taches, setTaches] = useState([
    { id: 1, nom: 'Paramétrage SAP FI', projetId: 1, consultantId: 1, charge: 5 },
    { id: 2, nom: 'Migration données', projetId: 1, consultantId: 2, charge: 3 },
    { id: 3, nom: 'Formation utilisateurs', projetId: 1, consultantId: 1, charge: 2 },
    { id: 4, nom: 'Config Oracle Cloud', projetId: 2, consultantId: 2, charge: 4 },
    { id: 5, nom: 'Tests integration', projetId: 2, consultantId: 3, charge: 3.5 },
  ]);

  const [affectations, setAffectations] = useState([
    { id: 1, tacheId: 1, date: '2025-01-06', periode: 'AM' },
    { id: 2, tacheId: 1, date: '2025-01-07', periode: 'AM' },
    { id: 3, tacheId: 1, date: '2025-01-07', periode: 'PM' },
    { id: 4, tacheId: 2, date: '2025-01-08', periode: 'AM' },
    { id: 5, tacheId: 4, date: '2025-01-09', periode: 'PM' },
  ]);

  const [activeView, setActiveView] = useState('planning');
  const [showAddTache, setShowAddTache] = useState(false);
  const [showAddConsultant, setShowAddConsultant] = useState(false);
  const [showAddProjet, setShowAddProjet] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editingTache, setEditingTache] = useState(null);
  const [editingConsultant, setEditingConsultant] = useState(null);
  const [newTache, setNewTache] = useState({ nom: '', projetId: '', consultantId: '', charge: '' });
  const [newConsultant, setNewConsultant] = useState({ nom: '', competences: '' });
  const [newProjet, setNewProjet] = useState({ nom: '', client: '' });

  const getJoursOuvresMois = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const jours = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        jours.push(new Date(d));
      }
    }
    return jours;
  };

  const joursOuvres = getJoursOuvresMois(currentMonth);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatJourCourt = (date) => {
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return jours[date.getDay()];
  };

  const formatJour = (date) => {
    return date.getDate();
  };

  const getProjet = (projetId) => {
    return projets.find(p => p.id === projetId);
  };

  const getConsultant = (consultantId) => {
    return consultants.find(c => c.id === consultantId);
  };

  const getAffectation = (tacheId, date, periode) => {
    return affectations.find(
      a => a.tacheId === tacheId && 
           a.date === formatDate(date) && 
           a.periode === periode
    );
  };

  const toggleAffectation = (tacheId, date, periode) => {
    const dateStr = formatDate(date);
    const existing = getAffectation(tacheId, date, periode);

    if (existing) {
      setAffectations(affectations.filter(a => a.id !== existing.id));
    } else {
      setAffectations([...affectations, {
        id: Date.now(),
        tacheId,
        date: dateStr,
        periode
      }]);
    }
  };

  const moisPrecedent = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const moisSuivant = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calculerChargePlanifiee = (tacheId) => {
    const affectationsTache = affectations.filter(a => a.tacheId === tacheId);
    return affectationsTache.length * 0.5; // Chaque affectation = 0.5 jour
  };

  const ajouterTache = () => {
    if (newTache.nom && newTache.projetId && newTache.consultantId && newTache.charge) {
      setTaches([...taches, {
        id: Date.now(),
        nom: newTache.nom,
        projetId: parseInt(newTache.projetId),
        consultantId: parseInt(newTache.consultantId),
        charge: parseFloat(newTache.charge)
      }]);
      setNewTache({ nom: '', projetId: '', consultantId: '', charge: '' });
      setShowAddTache(false);
    }
  };

  const updateChargeEstimee = (tacheId, newCharge) => {
    setTaches(taches.map(t => 
      t.id === tacheId ? { ...t, charge: parseFloat(newCharge) || 0 } : t
    ));
  };

  const supprimerTache = (tacheId) => {
    setTaches(taches.filter(t => t.id !== tacheId));
    setAffectations(affectations.filter(a => a.tacheId !== tacheId));
  };

  const ajouterConsultant = () => {
    if (newConsultant.nom) {
      const couleurs = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      setConsultants([...consultants, {
        id: Date.now(),
        nom: newConsultant.nom,
        competences: newConsultant.competences.split(',').map(c => c.trim()).filter(c => c),
        couleur: couleurs[consultants.length % couleurs.length]
      }]);
      setNewConsultant({ nom: '', competences: '' });
      setShowAddConsultant(false);
    }
  };

  const ajouterProjet = () => {
    if (newProjet.nom && newProjet.client) {
      setProjets([...projets, {
        id: Date.now(),
        nom: newProjet.nom,
        client: newProjet.client
      }]);
      setNewProjet({ nom: '', client: '' });
      setShowAddProjet(false);
    }
  };

  const effacerTout = () => {
    setTaches([]);
    setAffectations([]);
    setShowConfirmDelete(false);
  };

  const modifierTache = (tacheId, updates) => {
    setTaches(taches.map(t => 
      t.id === tacheId ? { ...t, ...updates } : t
    ));
    setEditingTache(null);
  };

  const modifierConsultant = (consultantId, updates) => {
    setConsultants(consultants.map(c => 
      c.id === consultantId ? { ...c, ...updates } : c
    ));
    setEditingConsultant(null);
  };

  const moisNom = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Planning ERP Consultants</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Effacer tout
              </button>
              <button
                onClick={() => setActiveView('planning')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'planning'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Planning
              </button>
              <button
                onClick={() => setActiveView('taches')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'taches'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tâches
              </button>
              <button
                onClick={() => setActiveView('consultants')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'consultants'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Consultants
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir effacer toutes les tâches et affectations ? 
              Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={effacerTout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Effacer tout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-full px-6 py-6">
        {/* Vue Planning */}
        {activeView === 'planning' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Planning par Tâches</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={moisPrecedent}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-semibold capitalize min-w-[200px] text-center">
                    {moisNom}
                  </span>
                  <button
                    onClick={moisSuivant}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Cliquez sur une case pour affecter/désaffecter une demi-journée</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                      Tâche
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b sticky left-[200px] bg-gray-50 z-10 min-w-[150px]">
                      Consultant
                    </th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-900 border-b sticky left-[350px] bg-gray-50 z-10 min-w-[90px]">
                      Charge (j)
                    </th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-900 border-b sticky left-[440px] bg-gray-50 z-10 min-w-[110px]">
                      Planifiée (j)
                    </th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-900 border-b sticky left-[550px] bg-gray-50 z-10 min-w-[50px]">
                      
                    </th>
                    {joursOuvres.map((jour, idx) => (
                      <th key={idx} className="px-2 py-3 text-center text-xs font-semibold text-gray-900 border-b min-w-[60px]">
                        <div>{formatJourCourt(jour)}</div>
                        <div className="text-lg">{formatJour(jour)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taches.map((tache) => {
                    const projet = getProjet(tache.projetId);
                    const consultant = getConsultant(tache.consultantId);
                    const chargePlanifiee = calculerChargePlanifiee(tache.id);
                    const isComplete = chargePlanifiee >= tache.charge;
                    const isOverloaded = chargePlanifiee > tache.charge;
                    
                    return (
                      <React.Fragment key={tache.id}>
                        {/* Ligne AM */}
                        <tr className="border-b hover:bg-gray-50">
                          <td 
                            rowSpan={2}
                            className="px-4 py-3 border-r bg-blue-50 sticky left-0 z-10"
                          >
                            <div className="font-medium text-gray-900">{tache.nom}</div>
                            <div className="text-xs text-gray-600 mt-1">{projet?.nom}</div>
                          </td>
                          <td 
                            rowSpan={2}
                            className="px-4 py-3 border-r sticky left-[200px] bg-white z-10"
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: consultant?.couleur }}
                              />
                              <span className="text-sm font-medium text-gray-900">{consultant?.nom}</span>
                            </div>
                          </td>
                          <td 
                            rowSpan={2}
                            className="px-2 py-3 border-r sticky left-[350px] bg-white z-10"
                          >
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={tache.charge}
                              onChange={(e) => updateChargeEstimee(tache.id, e.target.value)}
                              className="w-full px-2 py-1 text-center border rounded text-sm"
                            />
                          </td>
                          <td 
                            rowSpan={2}
                            className={`px-3 py-3 text-center font-semibold border-r sticky left-[440px] z-10 ${
                              isOverloaded ? 'bg-red-100 text-red-700' :
                              isComplete ? 'bg-green-100 text-green-700' : 
                              'bg-yellow-50 text-yellow-700'
                            }`}
                          >
                            <div className="text-sm">{chargePlanifiee}</div>
                            {isOverloaded && <div className="text-xs mt-1">Dépassement !</div>}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold text-xs text-gray-700 border-r bg-amber-50 sticky left-[550px] z-10">
                            AM
                          </td>
                          {joursOuvres.map((jour, jIdx) => {
                            const aff = getAffectation(tache.id, jour, 'AM');
                            
                            return (
                              <td key={jIdx} className="px-1 py-2">
                                <div
                                  onClick={() => toggleAffectation(tache.id, jour, 'AM')}
                                  className={`h-8 rounded cursor-pointer transition border ${
                                    aff
                                      ? 'bg-blue-500 border-blue-600 hover:bg-blue-600'
                                      : 'bg-gray-50 border-gray-200 hover:bg-blue-100 hover:border-blue-300'
                                  }`}
                                  title={aff ? 'AM - Affecté' : 'AM - Cliquer pour affecter'}
                                />
                              </td>
                            );
                          })}
                        </tr>
                        {/* Ligne PM */}
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 text-center font-semibold text-xs text-gray-700 border-r bg-orange-50 sticky left-[550px] z-10">
                            PM
                          </td>
                          {joursOuvres.map((jour, jIdx) => {
                            const aff = getAffectation(tache.id, jour, 'PM');
                            
                            return (
                              <td key={jIdx} className="px-1 py-2">
                                <div
                                  onClick={() => toggleAffectation(tache.id, jour, 'PM')}
                                  className={`h-8 rounded cursor-pointer transition border ${
                                    aff
                                      ? 'bg-blue-500 border-blue-600 hover:bg-blue-600'
                                      : 'bg-gray-50 border-gray-200 hover:bg-blue-100 hover:border-blue-300'
                                  }`}
                                  title={aff ? 'PM - Affecté' : 'PM - Cliquer pour affecter'}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
                  <span>Demi-journée affectée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-50 border border-amber-200 rounded"></div>
                  <span>AM = Matin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
                  <span>PM = Après-midi</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vue Tâches */}
        {activeView === 'taches' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tâches</h2>
                <button
                  onClick={() => setShowAddTache(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              {showAddTache && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="text"
                    placeholder="Nom de la tâche (ex: Paramétrage SAP FI)"
                    value={newTache.nom}
                    onChange={(e) => setNewTache({ ...newTache, nom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  />
                  <select
                    value={newTache.projetId}
                    onChange={(e) => setNewTache({ ...newTache, projetId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  >
                    <option value="">Sélectionner un projet</option>
                    {projets.map(p => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                  <select
                    value={newTache.consultantId}
                    onChange={(e) => setNewTache({ ...newTache, consultantId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  >
                    <option value="">Sélectionner un consultant</option>
                    {consultants.map(c => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Charge estimée (en jours)"
                    value={newTache.charge}
                    onChange={(e) => setNewTache({ ...newTache, charge: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={ajouterTache}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setShowAddTache(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {taches.map((tache) => {
                  const projet = getProjet(tache.projetId);
                  const consultant = getConsultant(tache.consultantId);
                  const chargePlanifiee = calculerChargePlanifiee(tache.id);
                  const isComplete = chargePlanifiee >= tache.charge;
                  const isEditing = editingTache?.id === tache.id;
                  
                  return (
                    <div key={tache.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingTache.nom}
                            onChange={(e) => setEditingTache({ ...editingTache, nom: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Nom de la tâche"
                          />
                          <select
                            value={editingTache.projetId}
                            onChange={(e) => setEditingTache({ ...editingTache, projetId: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            {projets.map(p => (
                              <option key={p.id} value={p.id}>{p.nom}</option>
                            ))}
                          </select>
                          <select
                            value={editingTache.consultantId}
                            onChange={(e) => setEditingTache({ ...editingTache, consultantId: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            {consultants.map(c => (
                              <option key={c.id} value={c.id}>{c.nom}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={editingTache.charge}
                            onChange={(e) => setEditingTache({ ...editingTache, charge: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Charge estimée (jours)"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => modifierTache(tache.id, editingTache)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={() => setEditingTache(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{tache.nom}</div>
                            <div className="text-sm text-gray-600 mt-1">Projet: {projet?.nom}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: consultant?.couleur }}
                              />
                              <span className="text-sm text-gray-700">{consultant?.nom}</span>
                            </div>
                            <div className="flex gap-4 mt-3 text-sm">
                              <div>
                                <span className="text-gray-600">Charge estimée: </span>
                                <span className="font-semibold">{tache.charge}j</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Planifiée: </span>
                                <span className={`font-semibold ${isComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                                  {chargePlanifiee}j
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingTache({ ...tache })}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => supprimerTache(tache.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Vue Projets */}
        {activeView === 'projets' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Consultants</h2>
                <button
                  onClick={() => setShowAddConsultant(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              {showAddConsultant && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="text"
                    placeholder="Nom du consultant"
                    value={newConsultant.nom}
                    onChange={(e) => setNewConsultant({ ...newConsultant, nom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Compétences (séparées par des virgules)"
                    value={newConsultant.competences}
                    onChange={(e) => setNewConsultant({ ...newConsultant, competences: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={ajouterConsultant}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setShowAddConsultant(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {consultants.map((consultant) => {
                  const isEditing = editingConsultant?.id === consultant.id;
                  
                  return (
                    <div key={consultant.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingConsultant.nom}
                            onChange={(e) => setEditingConsultant({ ...editingConsultant, nom: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Nom du consultant"
                          />
                          <input
                            type="text"
                            value={editingConsultant.competences.join(', ')}
                            onChange={(e) => setEditingConsultant({ 
                              ...editingConsultant, 
                              competences: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                            })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Compétences (séparées par des virgules)"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => modifierConsultant(consultant.id, editingConsultant)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={() => setEditingConsultant(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: consultant.couleur }}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{consultant.nom}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {consultant.competences.map((comp, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingConsultant({ ...consultant })}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Vue Consultants */}
        {activeView === 'consultants' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Consultants</h2>
                <button
                  onClick={() => setShowAddConsultant(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              {showAddConsultant && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="text"
                    placeholder="Nom du consultant"
                    value={newConsultant.nom}
                    onChange={(e) => setNewConsultant({ ...newConsultant, nom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Compétences (séparées par des virgules)"
                    value={newConsultant.competences}
                    onChange={(e) => setNewConsultant({ ...newConsultant, competences: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={ajouterConsultant}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setShowAddConsultant(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {consultants.map((consultant) => (
                  <div key={consultant.id} className="p-4 border rounded-lg hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: consultant.couleur }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{consultant.nom}</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {consultant.competences.map((comp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
