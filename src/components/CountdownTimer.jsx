import { useState, useEffect } from "react";
import { Clock, Info } from "lucide-react";
import { useElection } from "../hooks/useElection";

const CountdownTimer = () => {
  const { electionData } = useElection();
  const targetDate = electionData?.config?.pollingDate ?? electionData?.phases?.at(-1)?.date;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isActive: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0)
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isActive: false };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isActive: true,
      };
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) return null;
  const configLabel = electionData?.electionName || "Next Election";

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="mb-10 p-5 rounded-2xl bg-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4 border border-dark-border relative overflow-hidden">
      {!timeLeft.isActive && (
        <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <p className="text-white font-bold tracking-widest uppercase text-xs">
            No active election date set
          </p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-accent-purple" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-white font-bold text-sm tracking-tight">
              {configLabel}
            </p>
            <div className="group relative flex items-center">
              <Info className="w-3.5 h-3.5 text-text-muted hover:text-white cursor-help transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2.5 py-1.5 bg-dark-card border border-dark-border rounded shadow-xl text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all">
                Source: Election Commission of India (ECI)
              </div>
            </div>
          </div>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-0.5">
            Polling Day Countdown
          </p>
          <p className="text-text-muted text-xs mt-1">
            Until Lok Sabha Polling Day · April 2029 (estimated)
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="w-12 h-12 bg-dark-card border border-dark-border rounded-xl flex items-center justify-center shadow-premium">
              <span className="text-lg font-black text-white tabular-nums tracking-tighter">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[8px] text-text-muted mt-1 block font-bold uppercase tracking-widest">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
