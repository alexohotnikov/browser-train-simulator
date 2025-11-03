export function ControlsPanel({ uiState }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 16,
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        color: '#fff',
        padding: 12,
        borderRadius: 16,
        zIndex: 1000,
      }}
    >
      <button
        style={{
          padding: '8px 12px',
          borderRadius: 12,
          background: 'rgba(59, 130, 246, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseDown={() => {
          const interval = setInterval(() => {
            uiState.current.throttle = Math.min(1, uiState.current.throttle + 0.05);
          }, 50);
          const stop = () => {
            clearInterval(interval);
            window.removeEventListener("mouseup", stop);
            window.removeEventListener("mouseleave", stop);
          };
          window.addEventListener("mouseup", stop);
          window.addEventListener("mouseleave", stop);
        }}
      >
        ⬆ Throttle
      </button>

      <button
        style={{
          padding: '8px 12px',
          borderRadius: 12,
          background: 'rgba(59, 130, 246, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseDown={() => {
          const interval = setInterval(() => {
            uiState.current.throttle = Math.max(-0.2, uiState.current.throttle - 0.05);
          }, 50);
          const stop = () => {
            clearInterval(interval);
            window.removeEventListener("mouseup", stop);
            window.removeEventListener("mouseleave", stop);
          };
          window.addEventListener("mouseup", stop);
          window.addEventListener("mouseleave", stop);
        }}
      >
        ⬇ Throttle
      </button>

      <button
        style={{
          padding: '8px 12px',
          borderRadius: 12,
          background: 'rgba(245, 158, 11, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseDown={() => {
          const interval = setInterval(() => {
            uiState.current.brake = Math.min(1, uiState.current.brake + 0.05);
          }, 50);
          const stop = () => {
            clearInterval(interval);
            window.removeEventListener("mouseup", stop);
            window.removeEventListener("mouseleave", stop);
          };
          window.addEventListener("mouseup", stop);
          window.addEventListener("mouseleave", stop);
        }}
      >
        ⬆ Brake
      </button>

      <button
        style={{
          padding: '8px 12px',
          borderRadius: 12,
          background: 'rgba(245, 158, 11, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseDown={() => {
          const interval = setInterval(() => {
            uiState.current.brake = Math.max(0, uiState.current.brake - 0.05);
          }, 50);
          const stop = () => {
            clearInterval(interval);
            window.removeEventListener("mouseup", stop);
            window.removeEventListener("mouseleave", stop);
          };
          window.addEventListener("mouseup", stop);
          window.addEventListener("mouseleave", stop);
        }}
      >
        ⬇ Brake
      </button>

      <button
        style={{
          padding: '8px 12px',
          borderRadius: 12,
          background: 'rgba(107, 114, 128, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={() => (uiState.current.throttle = 0)}
      >
        Coast
      </button>

      <button
        style={{
          padding: '8px 12px',
          borderRadius: 12,
          background: 'rgba(239, 68, 68, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseDown={() => (uiState.current.emergency = true)}
        onMouseUp={() => (uiState.current.emergency = false)}
      >
        🚨 Emergency
      </button>
    </div>
  );
}

