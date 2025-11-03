import { useEffect, useState } from "react";

export function HUD({ uiState }) {
  const [, rerender] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    const id = setInterval(() => rerender((x) => x + 1), 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  const s = uiState.current;
  const throttlePercent = Math.max(0, (s.throttle || 0) * 100);
  const brakePercent = (s.brake || 0) * 100;
  const speedKmh = s.speed || 0;
  const speedLimit = s.speedLimit || null;
  const score = s.score || 0;
  const lastScoreEvent = s.lastScoreEvent || null;
  
  const cameraNames = {
    chase: 'Chase',
    cab: 'Cab',
    car: 'Car',
    top: 'Top View'
  };
  const cameraName = cameraNames[s.cameraMode] || 'Chase';
  
  return (
    <>
      <button
        onClick={toggleFullscreen}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          padding: '10px 14px',
          borderRadius: 12,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 18,
          zIndex: 1001,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
        }}
        title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
      >
        {isFullscreen ? '⛶' : '⛶'}
      </button>
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          maxWidth: 260,
          padding: 16,
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          color: '#fff',
          lineHeight: 1.25,
          fontSize: 13,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 16 }}>🚂 Train Simulator</div>
      <div style={{ marginBottom: 12, fontSize: 12, opacity: 0.8 }}>
        Camera: <b>{cameraName}</b>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span>Speed:</span>
          <b style={{ fontSize: 18, color: speedLimit && speedKmh > speedLimit ? '#ef4444' : undefined }}>{speedKmh.toFixed(1)}</b>
          <span style={{ fontSize: 11, opacity: 0.7 }}>km/h</span>
          {speedLimit && (
            <>
              <span style={{ fontSize: 11, opacity: 0.6 }}>/</span>
              <span style={{ 
                fontSize: 14, 
                fontWeight: 600,
                color: speedKmh > speedLimit ? '#ef4444' : '#34d399'
              }}>
                {speedLimit}
              </span>
            </>
          )}
        </div>
        <div style={{ width: 128, height: 8, background: 'rgba(55, 65, 81, 0.5)', borderRadius: 999, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ 
            height: '100%', 
            width: `${Math.min(100, (speedKmh / 70) * 100)}%`, 
            background: speedLimit && speedKmh > speedLimit 
              ? 'linear-gradient(90deg,#ef4444,#7f1d1d)' 
              : 'linear-gradient(90deg,#34d399,#059669)', 
            boxShadow: speedLimit && speedKmh > speedLimit 
              ? '0 0 8px rgba(239, 68, 68, 0.5)' 
              : '0 0 8px rgba(52, 211, 153, 0.5)' 
          }} />
        </div>
        {speedLimit && speedKmh > speedLimit && (
          <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>
            ⚠️ Превышение скорости!
          </div>
        )}
      </div>
      <div style={{ marginBottom: 12, padding: 8, borderRadius: 8, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span>Баллы:</span>
          <b style={{ fontSize: 18, color: '#fbbf24' }}>{score}</b>
        </div>
        {lastScoreEvent && (
          <div style={{ 
            fontSize: 11, 
            padding: 4,
            borderRadius: 4,
            background: lastScoreEvent.type === 'success' 
              ? 'rgba(52, 211, 153, 0.2)' 
              : lastScoreEvent.type === 'warning'
              ? 'rgba(251, 191, 36, 0.2)'
              : 'rgba(239, 68, 68, 0.2)',
            color: lastScoreEvent.type === 'success' 
              ? '#34d399' 
              : lastScoreEvent.type === 'warning'
              ? '#fbbf24'
              : '#ef4444',
            marginTop: 4
          }}>
            {lastScoreEvent.type === 'success' && '+'}{lastScoreEvent.points > 0 && `${lastScoreEvent.points} `}
            {lastScoreEvent.message}
          </div>
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span>Throttle:</span>
          <b>{throttlePercent.toFixed(0)}%</b>
        </div>
        <div style={{ width: 128, height: 8, background: 'rgba(55, 65, 81, 0.5)', borderRadius: 999, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ height: '100%', width: `${throttlePercent}%`, background: 'linear-gradient(90deg,#60a5fa,#2563eb)', boxShadow: '0 0 8px rgba(96, 165, 250, 0.5)' }} />
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span>Brake:</span>
          <b style={{ color: s.emergency ? '#fca5a5' : undefined }}>{brakePercent.toFixed(0)}%</b>
          {s.emergency && <span style={{ color: '#fca5a5', fontSize: 11 }}>EMER</span>}
        </div>
        <div style={{ width: 128, height: 8, background: 'rgba(55, 65, 81, 0.5)', borderRadius: 999, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{
            height: '100%',
            width: `${brakePercent}%`,
            background: s.emergency ? 'linear-gradient(90deg,#ef4444,#7f1d1d)' : 'linear-gradient(90deg,#fb923c,#c2410c)',
            boxShadow: s.emergency ? '0 0 8px rgba(239, 68, 68, 0.5)' : '0 0 8px rgba(251, 146, 60, 0.5)'
          }} />
        </div>
      </div>
      <div style={{ marginBottom: 6 }}>Dir: <b style={{ color: s.dir === -1 ? '#fbbf24' : undefined }}>{s.dir === -1 ? "REV" : "FWD"}</b></div>
      <div style={{ opacity: 0.7, marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: 11 }}>
        W/S gas · B/N brake · Space EMER · R rev · C cam · 1/2 light
      </div>
    </div>
    </>
  );
}

