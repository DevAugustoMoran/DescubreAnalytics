import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Target, MousePointerClick, BrainCircuit } from 'lucide-react';

// 1. REEMPLAZA ESTO CON TUS DATOS DE SUPABASE
const SUPABASE_URL = 'https://ehxuzdtewqfcbqrmujyn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4_yZ1k4pNciW181n9doiuw_AiIXMcy6';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Estilos extraídos
const cardStyle = { background: '#1E293B', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' };
const thStyle = { padding: '16px', fontWeight: 600, color: '#94A3B8', fontSize: 14 };
const tdStyle = { padding: '16px', verticalAlign: 'top' };

const getBadgeStyle = (perfil) => {
  let bg = '#334155', color = 'white';
  const perfilLower = perfil ? perfil.toLowerCase() : '';
  if (perfilLower.includes("decidido")) { bg = '#065F46'; color = '#6EE7B7'; }
  if (perfilLower.includes("captado")) { bg = '#854D0E'; color = '#FDE047'; }
  return { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color, display: 'inline-block' };
};

// 3. Componente Principal
export default function App() {
  const [stats, setStats] = useState({ inicios: 0, completos: 0, leads: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener eventos
        const { data: eventos } = await supabase.from('eventos').select('*');
        const inicios = eventos ? eventos.filter(e => e.evento === 'inicio_reto').length : 0;
        const completos = eventos ? eventos.filter(e => e.evento === 'completo_reto').length : 0;
        
        // Obtener leads
        const { data: leads } = await supabase.from('leads').select('*').order('fecha', { ascending: false });
        
        setStats({ inicios, completos, leads: leads || [] });
      } catch (error) {
        console.error("Error al cargar métricas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'white', background: '#0F172A', minHeight: '100vh' }}>
        Cargando métricas de Galileo...
      </div>
    );
  }

  const completionRate = stats.inicios > 0 ? Math.round((stats.completos / stats.inicios) * 100) : 0;

  return (
    <div style={{ background: '#0F172A', color: 'white', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ color: '#E8C978', marginBottom: 30, display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrainCircuit /> Galileo Analytics
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div style={cardStyle}>
            <MousePointerClick size={24} color="#94A3B8" />
            <h3 style={{ margin: '10px 0 5px' }}>Retos Iniciados</h3>
            <p style={{ fontSize: 32, margin: 0, fontWeight: 'bold' }}>{stats.inicios}</p>
          </div>
          <div style={cardStyle}>
            <Target size={24} color="#94A3B8" />
            <h3 style={{ margin: '10px 0 5px' }}>Tasa de Finalización</h3>
            <p style={{ fontSize: 32, margin: 0, fontWeight: 'bold' }}>{completionRate}%</p>
          </div>
          <div style={cardStyle}>
            <Users size={24} color="#E8C978" />
            <h3 style={{ margin: '10px 0 5px' }}>Leads Capturados</h3>
            <p style={{ fontSize: 32, margin: 0, fontWeight: 'bold', color: '#E8C978' }}>{stats.leads.length}</p>
          </div>
        </div>

        <h2 style={{ marginBottom: 20 }}>Prospectos Recientes (IA Scoring)</h2>
        <div style={{ background: '#1E293B', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#334155', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={thStyle}>Candidato</th>
                <th style={thStyle}>Carrera</th>
                <th style={thStyle}>Perfil IA</th>
                <th style={thStyle}>Análisis</th>
              </tr>
            </thead>
            <tbody>
              {stats.leads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={tdStyle}>
                    <strong>{lead.nombre}</strong><br/>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{lead.correo}</span>
                  </td>
                  <td style={tdStyle}>{lead.carrera_interes}</td>
                  <td style={tdStyle}>
                    <span style={getBadgeStyle(lead.perfil_ia)}>{lead.perfil_ia}</span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 13, color: '#CBD5E1', maxWidth: 300 }}>
                    {lead.resumen_ia}
                  </td>
                </tr>
              ))}
              
              {stats.leads.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>
                    Aún no hay leads registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}