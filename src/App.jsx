import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, Target, MousePointerClick, 
  BarChart2, Database, TrendingUp, PieChart, 
  Activity, Network, Search, Layers 
} from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const cardStyle = { background: '#1E293B', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 };
const thStyle = { padding: '16px', fontWeight: 600, color: '#94A3B8', fontSize: 14, whiteSpace: 'nowrap' };
const tdStyle = { padding: '16px', verticalAlign: 'top' };

const getBadgeStyle = (perfil) => {
  let bg = '#334155', color = 'white';
  const perfilLower = perfil ? perfil.toLowerCase() : '';
  if (perfilLower.includes("decidido")) { bg = '#065F46'; color = '#6EE7B7'; }
  if (perfilLower.includes("captado")) { bg = '#854D0E'; color = '#FDE047'; }
  if (perfilLower.includes("dudoso")) { bg = '#7F1D1D'; color = '#FCA5A5'; }
  return { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color, display: 'inline-block' };
};

const StickerGroup = () => (
  <div style={{ display: 'flex' }}>
    <BarChart2 size={70} className="sticker-icon" />
    <Database size={70} className="sticker-icon" />
    <TrendingUp size={70} className="sticker-icon" />
    <PieChart size={70} className="sticker-icon" />
    <Activity size={70} className="sticker-icon" />
    <Network size={70} className="sticker-icon" />
    <Search size={70} className="sticker-icon" />
    <Layers size={70} className="sticker-icon" />
  </div>
);

export default function App() {
  const [stats, setStats] = useState({ inicios: 0, completos: 0, leads: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventos } = await supabase.from('eventos').select('*');
        const inicios = eventos ? eventos.filter(e => e.evento === 'inicio_reto').length : 0;
        
        const { data: leads } = await supabase.from('leads').select('*').order('fecha', { ascending: false });
        
        setStats({ inicios, leads: leads || [] });
      } catch (error) {
        console.error("Error al cargar métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const subscription = supabase
      .channel('dashboard-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eventos' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'white', background: '#0F172A', minHeight: '100vh' }}>
        Cargando Descubre Analytics...
      </div>
    );
  }

  const completionRate = stats.inicios > 0 ? Math.round((stats.leads.length / stats.inicios) * 100) : 0;

  return (
    <div style={{ position: 'relative', color: 'white', minHeight: '100vh', padding: '20px 10px', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .bg-layer {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #0F172A;
            z-index: -1;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            overflow: hidden;
          }
          .sticker-track {
            display: flex;
            width: max-content;
            opacity: 0.03;
          }
          .track-left { animation: scroll-left 50s linear infinite; }
          .track-right { animation: scroll-right 60s linear infinite; }
          .sticker-icon {
            margin: 0 60px;
            color: #94A3B8;
          }
        `}
      </style>

      <div className="bg-layer">
        <div className="sticker-track track-left">
          <StickerGroup /><StickerGroup /><StickerGroup /><StickerGroup />
        </div>
        <div className="sticker-track track-right">
          <StickerGroup /><StickerGroup /><StickerGroup /><StickerGroup />
        </div>
        <div className="sticker-track track-left" style={{ animationDuration: '70s' }}>
          <StickerGroup /><StickerGroup /><StickerGroup /><StickerGroup />
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <h1 style={{ color: '#E8C978', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
          <img src="/logo.png" alt="Logo Universidad" style={{ height: 35, objectFit: 'contain' }} /> 
          Descubre Analytics
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 15, marginBottom: 30 }}>
          <div style={cardStyle}>
            <MousePointerClick size={24} color="#94A3B8" />
            <h3 style={{ margin: '10px 0 5px', fontSize: 16 }}>Retos Iniciados</h3>
            <p style={{ fontSize: 28, margin: 0, fontWeight: 'bold' }}>{stats.inicios}</p>
          </div>
          <div style={cardStyle}>
            <Target size={24} color="#94A3B8" />
            <h3 style={{ margin: '10px 0 5px', fontSize: 16 }}>Tasa de Conversión (Leads)</h3>
            <p style={{ fontSize: 28, margin: 0, fontWeight: 'bold' }}>{completionRate}%</p>
          </div>
          <div style={cardStyle}>
            <Users size={24} color="#E8C978" />
            <h3 style={{ margin: '10px 0 5px', fontSize: 16 }}>Leads Capturados</h3>
            <p style={{ fontSize: 28, margin: 0, fontWeight: 'bold', color: '#E8C978' }}>{stats.leads.length}</p>
          </div>
        </div>

        <h2 style={{ marginBottom: 15, fontSize: '1.25rem' }}>Prospectos Recientes (IA Scoring)</h2>
        
        {/* CONTENEDOR CON DESPLAZAMIENTO HORIZONTAL PARA MÓVILES */}
        <div style={{ background: '#1E293B', borderRadius: 12, overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px' }}>
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
                  <td style={{ ...tdStyle, fontSize: 13, color: '#CBD5E1', minWidth: 250, lineHeight: 1.5 }}>
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